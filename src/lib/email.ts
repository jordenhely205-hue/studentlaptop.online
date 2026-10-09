import nodemailer from "nodemailer";

// Zoho Mail Transactional SMTP Configuration (noreply@studentlaptop.online)
// Configurable via environment variables with robust fallback resolution
export function getSmtpConfig() {
  const host = (process.env.SMTP_HOST || "smtppro.zoho.com").trim();
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = port === 465;
  const user = (
    process.env.SMTP_USER ||
    process.env.SMTP_USERNAME ||
    process.env.ZOHO_USER ||
    process.env.EMAIL_USER ||
    "noreply@studentlaptop.online"
  ).trim();
  const pass = (
    process.env.SMTP_PASS ||
    process.env.SMTP_PASSWORD ||
    process.env.ZOHO_PASSWORD ||
    process.env.ZOHO_PASS ||
    process.env.EMAIL_PASSWORD ||
    process.env.MAIL_PASSWORD ||
    ""
  ).trim();
  const from = (
    process.env.SMTP_FROM ||
    `"STUDENT LAPTOP ONLINE" <${user}>`
  ).trim();

  return { host, port, secure, user, pass, from };
}

export function getTransporter() {
  const { host, port, secure, user, pass } = getSmtpConfig();

  if (!pass) {
    console.error(
      "[Zoho SMTP] ERROR: SMTP password is not set! Please define SMTP_PASS or ZOHO_PASSWORD in your environment variables."
    );
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure, // true for 465 SSL
    auth: {
      user,
      pass,
    },
    connectionTimeout: 10000, // 10s connection timeout for serverless
    greetingTimeout: 10000,
    socketTimeout: 15000,
    tls: {
      rejectUnauthorized: false, // Prevents SSL handshaking rejection in proxy/serverless environments
    },
    debug: process.env.NODE_ENV !== "production" || process.env.SMTP_DEBUG === "true",
    logger: false,
    headers: {
      "X-Entity-Ref-ID": `SLO-${Date.now()}`,
    },
  });
}

export async function sendOtpEmail(toEmail: string, studentName: string, otpCode: string) {
  const { from, host, port, user, pass } = getSmtpConfig();

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your OTP Verification Code</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #1e293b; }
        .container { max-width: 580px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background: #1e3a8a; padding: 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; }
        .content { padding: 32px 28px; }
        .salutation { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 12px; }
        .message { font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 24px; }
        .otp-box { background: #eff6ff; border: 2px dashed #3b82f6; border-radius: 8px; padding: 18px; text-align: center; margin: 24px 0; }
        .otp-label { font-size: 13px; font-weight: 700; color: #1d4ed8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .otp-code { font-size: 34px; font-weight: 800; color: #1e3a8a; letter-spacing: 8px; font-family: 'Courier New', monospace; }
        .warning { font-size: 13px; color: #64748b; line-height: 1.5; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 16px; }
        .footer { background: #f8fafc; padding: 18px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>STUDENT LAPTOP ONLINE</h1>
        </div>
        <div class="content">
          <div class="salutation">Dear ${studentName || "Applicant"},</div>
          <div class="message">
            Thank you for applying for the <strong>Honahar Student Laptop Scheme (Session 2026)</strong>. Please use the verification code below to verify your email address and generate your candidate challan.
          </div>
          <div class="otp-box">
            <div class="otp-label">One-Time Verification Code (OTP)</div>
            <div class="otp-code">${otpCode}</div>
          </div>
          <div class="warning">
            • This verification code is valid for <strong>10 minutes</strong>.<br>
            • For your security, do <strong>NOT</strong> share this OTP with anyone.<br>
            • If you did not initiate this registration, please disregard this email.
          </div>
        </div>
        <div class="footer">
          &copy; 2026 STUDENT LAPTOP ONLINE. All Rights Reserved.<br>
          Official Portal: <a href="https://www.studentlaptop.online" style="color: #3b82f6; text-decoration: none;">www.studentlaptop.online</a> &bull; Support: <a href="mailto:info@studentlaptop.online" style="color: #3b82f6; text-decoration: none;">info@studentlaptop.online</a>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `Dear ${studentName || "Applicant"},\n\nYour OTP Verification Code for STUDENT LAPTOP ONLINE is: ${otpCode}\n\nThis code is valid for 10 minutes. Do not share it with anyone.\n\nWebsite: https://www.studentlaptop.online\nSupport: info@studentlaptop.online`;

  // 1. Try Resend API if RESEND_API_KEY is configured
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: toEmail,
          subject: `${otpCode} is your STUDENT LAPTOP ONLINE verification code`,
          html: htmlContent,
          text: textContent,
        }),
      });
      if (res.ok) {
        console.log(`[Resend API] Successfully sent OTP to ${toEmail}`);
        return { success: true, provider: "resend" };
      } else {
        const errorText = await res.text();
        console.warn(`[Resend API Error] ${res.status}: ${errorText}`);
      }
    } catch (resendErr) {
      console.warn("[Resend API failed, falling back to Zoho SMTP]:", resendErr);
    }
  }

  // 2. Send via Zoho Mail SMTP (smtppro.zoho.com:465)
  const transporter = getTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from,
        to: toEmail,
        subject: `${otpCode} is your STUDENT LAPTOP ONLINE verification code`,
        text: textContent,
        html: htmlContent,
        headers: {
          "X-Priority": "1",
          Importance: "high",
        },
      });
      console.log(`[Zoho SMTP] Successfully sent OTP to ${toEmail}. MessageId: ${info.messageId}`);
      return { success: true, provider: "smtp", messageId: info.messageId };
    } catch (smtpErr: any) {
      console.error("[Zoho SMTP Error] Failed to send email:", {
        host,
        port,
        user,
        recipient: toEmail,
        code: smtpErr?.code,
        command: smtpErr?.command,
        response: smtpErr?.response,
        message: smtpErr?.message,
      });
      return {
        success: false,
        error: smtpErr?.message || "Zoho SMTP dispatch failed",
        provider: "smtp",
      };
    }
  }

  // 3. Fallback when SMTP_PASS is missing
  console.warn(
    `[Zoho SMTP Not Configured] SMTP password is missing. Could not deliver OTP email to ${toEmail}.`
  );
  return {
    success: false,
    error: "SMTP credentials not configured on server (SMTP_PASS missing).",
    provider: "none",
  };
}
