module.exports = {
    async afterCreate(event) {
        const { result } = event;

        console.log('=== LIFECYCLE TRIGGERED FOR MESSAGE ID:', result.id, '===');

        // This will throw the exact error straight into your Render logs if anything fails
        await strapi.plugins['email'].services.email.send({
            to: 'mirsahmubthaseem@gmail.com',
            subject: `New Contact Form Message from ${result.firstName} ${result.lastName}`,
            text: `You received a new message from your website contact form:\n\nName: ${result.firstName} ${result.lastName}\nEmail: ${result.email}\nMessage:\n${result.message}`,
            html: `<h3>New Contact Form Message</h3>
                   <p><strong>Name:</strong> ${result.firstName} ${result.lastName}</p>
                   <p><strong>Email:</strong> ${result.email}</p>
                   <p><strong>Message:</strong><br/>${result.message}</p>`,
        });

        console.log('=== EMAIL SENT SUCCESSFULLY ===');
    },
};