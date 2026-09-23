export default {
    routes: [
        {
            method: 'GET',
            path: '/homepage-bundle',
            handler: 'homepage-bundle.getBundle',
            config: {
                auth: false, // Set to true if this requires authentication
            },
        },
    ],
};