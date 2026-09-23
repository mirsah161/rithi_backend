import type { Core } from '@strapi/strapi';

export default {
    async getBundle(ctx: any) {
        try {
            // Using the recommended Document Service API in Strapi v5
            const [homePage, aboutSections, services, workSections] = await Promise.all([
                strapi.documents('api::home-page.home-page').findMany({ populate: '*' }),
                strapi.documents('api::about-section.about-section').findMany({ populate: '*' }),
                strapi.documents('api::service.service').findMany({ populate: '*' }),
                strapi.documents('api::work-section.work-section').findMany({ populate: '*' }),
            ]);

            return ctx.send({
                data: {
                    homePage,
                    aboutSections,
                    services,
                    workSections,
                },
            });
        } catch (err) {
            ctx.badRequest('Failed to fetch homepage bundle data', { error: err });
        }
    },
};