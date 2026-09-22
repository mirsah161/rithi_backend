import type { Core } from '@strapi/strapi';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    console.log('=== DEBUG: content-types registry check (register phase) ===');
    const uids = Object.keys(strapi.contentTypes);
    console.log('Total registered content-types:', uids.length);

    const apiUids = uids.filter((u) => u.startsWith('api::'));
    console.log('api:: content-types found:', apiUids.length, JSON.stringify(apiUids));

    apiUids.forEach((uid) => {
      const ct = (strapi.contentTypes as any)[uid];
      console.log(uid, '-> kind:', ct ? ct.kind : 'MODEL IS UNDEFINED/NULL');
    });

    console.log('=== DEBUG: strapi.apis registry ===');
    const apiNames = Object.keys((strapi as any).apis || {});
    console.log('strapi.apis keys:', JSON.stringify(apiNames));
    apiNames.forEach((name) => {
      const api = (strapi as any).apis[name];
      let routeInfo = 'NO ROUTES PROPERTY';
      try {
        routeInfo = api?.routes ? JSON.stringify(Object.keys(api.routes)) : 'ROUTES UNDEFINED';
      } catch (e: any) {
        routeInfo = 'ERROR ACCESSING ROUTES: ' + e.message;
      }
      console.log('api:', name, '-> routes:', routeInfo);
    });

    console.log('=== END DEBUG ===');
  },

  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) { },
};