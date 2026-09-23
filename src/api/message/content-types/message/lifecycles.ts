export default {
    async afterCreate(event: { result: any }) {
        const { result } = event;
        console.log('--- LIFECYCLE afterCreate TRIGGERED FOR MESSAGE ---', result);

        const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 8px;">New Website Inquiry</h2>
        <p style="font-size: 14px; color: #555;">You have received a new message from your contact form:</p>
        
        <table style="width: 100%; font-size: 14px; color: #333; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 120px;">First Name:</td>
            <td style="padding: 8px;">${result.firstName}</td>
          </tr>
          <tr style="background-color: #fff;">
            <td style="padding: 8px; font-weight: bold;">Last Name:</td>
            <td style="padding: 8px;">${result.lastName || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Email:</td>
            <td style="padding: 8px;"><a href="mailto:${result.email}" style="color: #007bff;">${result.email}</a></td>
          </tr>
        </table>

        <div style="margin-top: 20px; background: #fff; padding: 15px; border-radius: 6px; border: 1px solid #ddd;">
          <p style="font-weight: bold; margin-bottom: 5px; color: #333;">Message:</p>
          <p style="color: #444; line-height: 1.5; white-space: pre-wrap;">${result.message}</p>
        </div>
      </div>
    `;

        try {
            await strapi.plugins['email'].services.email.send({
                to: 'mirsahmubthaseem@gmail.com',
                subject: `New Message from ${result.firstName} ${result.lastName || ''}`,
                text: `Name: ${result.firstName} ${result.lastName}\nEmail: ${result.email}\nMessage: ${result.message}`,
                html: htmlContent,
            });
            console.log('--- EMAIL SENT SUCCESSFULLY VIA RESEND ---');
        } catch (err) {
            console.error('--- DETAILED EMAIL ERROR ---', err);
        }
    },
};