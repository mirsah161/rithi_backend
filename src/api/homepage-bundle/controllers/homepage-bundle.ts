import type { Core } from '@strapi/strapi';

export default {
    async getBundle(ctx: any) {
        try {
            // Exactly matching your 4 frontend queries
            const [homePage, aboutSections, services, workSections] = await Promise.all([
                strapi.entityService.findMany('api::home-page.home-page', { populate: '*' }),
                strapi.entityService.findMany('api::about-section.about-section', { populate: '*' }),
                strapi.entityService.findMany('api::service.service', { populate: '*' }),
                strapi.entityService.findMany('api::work-section.work-section', { populate: '*' }),
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