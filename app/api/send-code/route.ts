import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email and code are required' },
        { status: 400 }
      );
    }

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || 'Mektup Arkadaşı <no-reply@mektuparkadasi.net>';

    // If SMTP environment variables are configured, send a real email
    if (host && port && user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port: parseInt(port),
        secure: parseInt(port) === 465, // true for port 465, false for other ports
        auth: {
          user,
          pass,
        },
      });

      const mailOptions = {
        from,
        to: email,
        subject: 'mektuparkadasi.net — E-posta Doğrulama Kodu',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #f3f4f6; padding-bottom: 20px;">
              <h2 style="color: #991b1b; margin: 0;">mektuparkadasi.net</h2>
              <p style="color: #4b5563; font-size: 14px; margin: 5px 0 0 0;">Nostaljik & Yavaş İletişim Kulübü</p>
            </div>
            <div style="padding: 10px 0;">
              <p style="font-size: 16px; color: #1f2937; line-height: 1.5;">Merhaba,</p>
              <p style="font-size: 16px; color: #1f2937; line-height: 1.5;">mektuparkadasi.net'e üye olmak için doğrulama kodunuz aşağıdadır:</p>
              
              <div style="text-align: center; margin: 30px 0; padding: 15px; background-color: #fef2f2; border: 1px dashed #fca5a5; border-radius: 8px;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #b91c1c;">${code}</span>
              </div>
              
              <p style="font-size: 14px; color: #6b7280; line-height: 1.5; margin-top: 20px;">
                Bu kodu üyelik ekranındaki doğrulama alanına girerek kaydınızı tamamlayabilirsiniz. Kod 10 dakika boyunca geçerlidir.
              </p>
            </div>
            <div style="margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 20px; font-size: 12px; color: #9ca3af; text-align: center;">
              Bu e-posta güvenlik doğrulaması amacıyla otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`[SMTP] Verification email sent successfully to: ${email}`);
      return NextResponse.json({ success: true, message: 'Real email sent successfully' });
    } else {
      // If SMTP is NOT configured, print the code to the Next.js server terminal (Simulation Mode)
      console.log('\n======================================================');
      console.log('📬 [SİMÜLASYON] E-POSTA DOĞRULAMA KODU');
      console.log(`Alıcı E-posta: ${email}`);
      console.log(`Doğrulama Kodu: ${code}`);
      console.log('======================================================\n');

      return NextResponse.json({ 
        success: true, 
        message: 'SMTP is not configured. Verification code is logged to the server terminal.',
        simulated: true 
      });
    }
  } catch (error: any) {
    console.error('Error sending verification email:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send verification email' },
      { status: 500 }
    );
  }
}
