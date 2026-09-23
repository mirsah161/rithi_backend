const escapeHtml = (str: string = '') =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export default {
    async afterCreate(event: { result: any }) {
        const { result } = event;
        console.log('--- LIFECYCLE afterCreate TRIGGERED FOR MESSAGE ---', result.id);

        const firstName = escapeHtml(result.firstName);
        const lastName = escapeHtml(result.lastName || '');
        const email = escapeHtml(result.email);
        const message = escapeHtml(result.message);
        const submittedAt = new Date(result.createdAt || Date.now()).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });

        const htmlContent = `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#000000; padding: 28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#34d399; font-size:12px; font-family: 'Courier New', monospace; letter-spacing: 2px; text-transform: uppercase;">
                    Ridhitech India Pvt Ltd
                  </td>
                </tr>
                <tr>
                  <td style="color:#ffffff; font-size:20px; font-weight:bold; padding-top: 6px;">
                    New Contact Form Submission
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent bar -->
          <tr>
            <td style="height:4px; background-color:#34d399; font-size:0; line-height:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin:0 0 20px 0; font-size:13px; color:#71717a;">
                Received on ${submittedAt}
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size:12px; color:#a1a1aa; text-transform:uppercase; letter-spacing:0.5px; width:110px;">Name</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size:15px; color:#18181b; font-weight:600;">${firstName} ${lastName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size:12px; color:#a1a1aa; text-transform:uppercase; letter-spacing:0.5px;">Email</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size:15px;">
                    <a href="mailto:${email}" style="color:#059669; text-decoration:none; font-weight:600;">${email}</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0; font-size:12px; color:#a1a1aa; text-transform:uppercase; letter-spacing:0.5px;">Message</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb; border-radius:8px; border-left: 3px solid #34d399;">
                <tr>
                  <td style="padding: 16px 18px; font-size:14px; color:#3f3f46; line-height:1.7; white-space:pre-wrap;">${message}</td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top: 28px;">
                <tr>
                  <td style="border-radius:8px; background-color:#000000;">
                    <a href="mailto:${email}" style="display:inline-block; padding: 12px 24px; font-size:13px; font-weight:600; color:#34d399; text-decoration:none; font-family: 'Courier New', monospace;">
                      Reply to ${firstName} &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color:#fafafa; border-top: 1px solid #f0f0f0;">
              <p style="margin:0; font-size:11px; color:#a1a1aa; text-align:center;">
                Sent automatically from the contact form at ridhitechindia.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

        strapi.plugins['email'].services.email.send({
            to: 'mirsahmubthaseem@gmail.com',
            replyTo: result.email,
            subject: `New Message from ${result.firstName} ${result.lastName || ''}`.trim(),
            text: `Name: ${result.firstName} ${result.lastName || ''}\nEmail: ${result.email}\nMessage: ${result.message}`,
            html: htmlContent,
        })
            .then(() => console.log('--- EMAIL SENT SUCCESSFULLY VIA RESEND ---'))
            .catch((err: any) => console.error('--- DETAILED EMAIL ERROR ---', err));
    },
};