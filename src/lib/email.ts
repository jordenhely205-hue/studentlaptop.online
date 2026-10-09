import nodemailer from "nodemailer";

// Diagnostic and Credentials Resolver for Zoho Mail & Transactional SMTP
export function resolveSmtpCredentials() {
  const envCandidates = [
    { key: "SMTP_PASS", val: process.env.SMTP_PASS },
    { key: "SMTP_PASSWORD", val: process.env.SMTP_PASSWORD },
    { key: "ZOHO_PASSWORD", val: process.env.ZOHO_PASSWORD },
    { key: "ZOHO_PASS", val: process.env.ZOHO_PASS },
    { key: "ZOHO_APP_PASSWORD", val: process.env.ZOHO_APP_PASSWORD },
    { key: "APP_PASSWORD", val: process.env.APP_PASSWORD },
    { key: "EMAIL_PASSWORD", val: process.env.EMAIL_PASSWORD },
    { key: "EMAIL_PASS", val: process.env.EMAIL_PASS },
    { key: "MAIL_PASSWORD", val: process.env.MAIL_PASSWORD },
    { key: "NOREPLY_PASSWORD", val: process.env.NOREPLY_PASSWORD },
  ];

  const matched = envCandidates.find((c) => c.val && c.val.trim().length > 0);
  const rawPass = matched ? matched.val!.trim() : "";
  const matchedKey = matched ? matched.key : "none";

  // Handle surrounding quotes (e.g. "pass" or 'pass')
  const passNoQuotes = rawPass.replace(/^["']|["']$/g, "").trim();
  // Handle Zoho App Password spaces (Zoho generates app passwords like "xxxx xxxx xxxx xxxx")
  const passNoSpaces = passNoQuotes.replace(/\s+/g, "");

  const user = (
    process.env.SMTP_USER ||
    process.env.SMTP_USERNAME ||
    process.env.ZOHO_USER ||
    process.env.EMAIL_USER ||
    "noreply@studentlaptop.online"
  ).trim();

  const host = (
    process.env.SMTP_HOST ||
    process.env.ZOHO_HOST ||
    "smtppro.zoho.com"
  ).trim();

  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const from = (
    process.env.SMTP_FROM ||
    `"STUDENT LAPTOP ONLINE" <${user}>`
  ).trim();

  const maskedPass =
    rawPass.length > 4
      ? `${rawPass.slice(0, 2)}****${rawPass.slice(-2)} (${rawPass.length} chars)`
      : rawPass.length > 0
      ? "****"
      : "MISSING";

  return {
    rawPass,
    passNoQuotes,
    passNoSpaces,
    matchedKey,
    maskedPass,
    user,
    host,
    port,
    from,
  };
}

export async function sendOtpEmail(toEmail: string, studentName: string, otpCode: string) {
  const creds = resolveSmtpCredentials();
  const { from, host, user, passNoSpaces, passNoQuotes, rawPass, matchedKey, maskedPass } = creds;

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

  // 1. Try Resend API if configured
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

  if (!rawPass) {
    console.error(
      "[Zoho SMTP] ERROR: No SMTP password found in environment variables (checked SMTP_PASS, SMTP_PASSWORD, ZOHO_PASSWORD, ZOHO_PASS, ZOHO_APP_PASSWORD)."
    );
    return {
      success: false,
      error: "SMTP credentials not configured on server (SMTP_PASS missing).",
      provider: "none",
      debug: {
        matchedKey,
        maskedPass,
        user,
        host,
      },
    };
  }

  // 2. Multi-Candidate Zoho SMTP Engine
  // Attempts configurations in priority order:
  // (a) Configured host on Port 465 SSL with spaceless password
  // (b) Configured host on Port 465 SSL with unstripped password (if different)
  // (c) Fallback host smtp.zoho.com on Port 465 SSL (standard Zoho custom domains)
  // (d) Configured host on Port 587 STARTTLS
  // (e) Fallback host smtp.zoho.com on Port 587 STARTTLS
  const candidateTargets: Array<{
    name: string;
    host: string;
    port: number;
    secure: boolean;
    pass: string;
  }> = [];

  // Candidate 1: Primary 465 SSL (spaceless pass)
  candidateTargets.push({
    name: `${host}:465 (SSL, no-spaces)`,
    host,
    port: 465,
    secure: true,
    pass: passNoSpaces,
  });

  // Candidate 2: Primary 465 SSL with unstripped spaces if pass has spaces
  if (passNoQuotes !== passNoSpaces) {
    candidateTargets.push({
      name: `${host}:465 (SSL, with-spaces)`,
      host,
      port: 465,
      secure: true,
      pass: passNoQuotes,
    });
  }

  // Candidate 3: Alternative Zoho host smtp.zoho.com (for non-Workplace domain accounts)
  if (host !== "smtp.zoho.com") {
    candidateTargets.push({
      name: "smtp.zoho.com:465 (SSL)",
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      pass: passNoSpaces,
    });
  }

  // Candidate 4: Primary host on 587 STARTTLS
  candidateTargets.push({
    name: `${host}:587 (TLS)`,
    host,
    port: 587,
    secure: false,
    pass: passNoSpaces,
  });

  // Candidate 5: smtp.zoho.com on 587 STARTTLS
  if (host !== "smtp.zoho.com") {
    candidateTargets.push({
      name: "smtp.zoho.com:587 (TLS)",
      host: "smtp.zoho.com",
      port: 587,
      secure: false,
      pass: passNoSpaces,
    });
  }

  const errors: string[] = [];

  for (const target of candidateTargets) {
    try {
      const transporter = nodemailer.createTransport({
        host: target.host,
        port: target.port,
        secure: target.secure,
        auth: {
          user,
          pass: target.pass,
        },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 10000,
        tls: {
          rejectUnauthorized: false,
        },
        headers: {
          "X-Entity-Ref-ID": `SLO-${Date.now()}`,
        },
      });

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

      console.log(
        `[Zoho SMTP Success] Dispatched OTP to ${toEmail} via ${target.name}. MessageId: ${info.messageId}`
      );

      return {
        success: true,
        provider: "smtp",
        target: target.name,
        messageId: info.messageId,
      };
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      console.warn(`[Zoho SMTP Attempt Failed] ${target.name}: ${errMsg}`);
      errors.push(`${target.name}: ${errMsg}`);
      
      // If error is not authentication-related (e.g. rate limit or invalid recipient), don't keep hammering
      if (err?.code === "EENVELOPE" || err?.responseCode === 550) {
        break;
      }
    }
  }

  const primaryError = errors[0] || "Zoho SMTP dispatch failed";

  console.error("[Zoho SMTP All Candidates Failed]:", {
    user,
    matchedKey,
    maskedPass,
    errors,
  });

  return {
    success: false,
    error: primaryError,
    provider: "smtp",
    attempts: errors,
    debug: {
      user,
      host,
      matchedKey,
      maskedPass,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      guidance:
        "If you see '535 Authentication Failed': 1) In Zoho Accounts (accounts.zoho.com) -> Security -> App Passwords, generate a 16-character App Password and set it as SMTP_PASS in Vercel. 2) In Zoho Mail (mailadmin.zoho.com) -> Users -> noreply@studentlaptop.online -> Mail Settings, verify 'SMTP Access' is enabled.",
    },
  };
}
