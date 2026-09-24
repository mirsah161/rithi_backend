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
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:12px; overflow:hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">

          <!-- Header (Clean Light Style with Emerald Branding) -->
          <tr>
            <td style="background-color:#ffffff; padding: 32px 32px 20px 32px; border-bottom: 1px solid #edf2f7;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#059669; font-size:12px; font-family: 'Courier New', monospace; letter-spacing: 2px; text-transform: uppercase; font-weight:700;">
                    Ridhitech India Pvt Ltd
                  </td>
                </tr>
                <tr>
                  <td style="color:#1e293b; font-size:22px; font-weight:bold; padding-top: 8px;">
                    New Contact Form Submission
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent bar -->
          <tr>
            <td style="height:3px; background: linear-gradient(90deg, #10b981 0%, #34d399 100%); font-size:0; line-height:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin:0 0 24px 0; font-size:13px; color:#64748b;">
                Received on <strong style="color:#334155;">${submittedAt}</strong>
              </p>

              <!-- Sender Details Table -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size:12px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px; width:110px; font-weight:600;">Name</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size:15px; color:#0f172a; font-weight:600;">${firstName} ${lastName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size:12px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Email</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size:15px;">
                    <a href="mailto:${email}" style="color:#059669; text-decoration:none; font-weight:600;">${email}</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0; font-size:12px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Message Content</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; border-radius:8px; border: 1px solid #e2e8f0; border-left: 4px solid #10b981;">
                <tr>
                  <td style="padding: 18px; font-size:14px; color:#334155; line-height:1.7; white-space:pre-wrap;">${message}</td>
                </tr>
              </table>

              <!-- CTA Reply Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
                <tr>
                  <td style="border-radius:8px; background-color:#0f172a;">
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
            <td style="padding: 20px 32px; background-color:#f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="margin:0; font-size:11px; color:#94a3b8; text-align:center;">
                Sent automatically from the contact form at <a href="https://ridhitechindia.com" style="color:#64748b; text-decoration:underline;" target="_blank">ridhitechindia.com</a>
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