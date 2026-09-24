/**
 * message controller
 */

import { factories } from '@strapi/strapi';

// Simple in-memory rate-limiting store (IP Address -> Array of Timestamps)
const submissionTracker = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes time window
const MAX_REQUESTS = 3;           // Maximum 3 messages allowed per window per IP

export default factories.createCoreController('api::message.message', ({ strapi }) => ({
    async create(ctx) {
        // 1. Extract client IP (handles proxies like Cloudflare, Nginx, or Vercel)
        const forwardedHeader = ctx.request.headers['x-forwarded-for'];
        const ip = Array.isArray(forwardedHeader)
            ? forwardedHeader[0]
            : forwardedHeader || ctx.ip || 'unknown';

        const clientIp = typeof ip === 'string' ? ip.split(',')[0].trim() : 'unknown';
        const now = Date.now();

        // 2. Clean up expired timestamps and check rate limits
        let timestamps = submissionTracker.get(clientIp) || [];
        timestamps = timestamps.filter((timestamp: number) => now - timestamp < WINDOW_MS);

        if (timestamps.length >= MAX_REQUESTS) {
            ctx.status = 429;
            ctx.body = {
                data: null,
                error: {
                    status: 429,
                    name: 'TooManyRequests',
                    message: 'Too many messages sent from this network address. Please try again later.',
                },
            };
            return;
        }

        // 3. Server-side Payload Validation & Type Assertion
        const requestBody = ctx.request.body as { data?: Record<string, any> };
        const data = requestBody?.data;

        if (!data || !data.firstName || !data.email || !data.message || !data.token) {
            return ctx.badRequest('Missing required fields or security token.');
        }

        // Validate email format on server side
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return ctx.badRequest('Invalid email address format.');
        }

        // 4. Verify Google reCAPTCHA v3 Token
        try {
            const secretKey = process.env.RECAPTCHA_SECRET_KEY;
            const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${data.token}`;

            const recaptchaRes = await fetch(verifyUrl, { method: 'POST' });
            const recaptchaJson = (await recaptchaRes.json()) as { success: boolean; score?: number };

            // reCAPTCHA v3 returns a score from 0.0 (bot) to 1.0 (human)
            if (!recaptchaJson.success || (recaptchaJson.score !== undefined && recaptchaJson.score < 0.5)) {
                return ctx.badRequest('Suspicious activity detected. Submission blocked.');
            }
        } catch (error) {
            console.error('reCAPTCHA verification network error:', error);
            return ctx.badRequest('Failed to verify security token.');
        }

        // Remove the temporary token from data so Strapi doesn't crash trying to save it to your database schema
        delete data.token;

        // 5. Record current request timestamp for this IP
        timestamps.push(now);
        submissionTracker.set(clientIp, timestamps);

        // 6. Proceed with standard Strapi creation logic
        return super.create(ctx);
    },
}));