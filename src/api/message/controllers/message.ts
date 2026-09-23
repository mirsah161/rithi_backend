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
        timestamps = timestamps.filter(timestamp => now - timestamp < WINDOW_MS);

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

        // 3. Server-side Payload Validation
        const { data } = ctx.request.body;
        if (!data || !data.firstName || !data.email || !data.message) {
            return ctx.badRequest('Missing required fields: firstName, email, or message.');
        }

        // Validate email format on server side
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return ctx.badRequest('Invalid email address format.');
        }

        // 4. Record current request timestamp for this IP
        timestamps.push(now);
        submissionTracker.set(clientIp, timestamps);

        // 5. Proceed with the standard Strapi creation logic.
        // This triggers your database save and automatically calls your existing afterCreate lifecycle hook (sending the email via Resend)!
        return super.create(ctx);
    },
}));