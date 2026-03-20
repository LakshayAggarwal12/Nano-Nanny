const nodemailer = require("nodemailer");

exports.sendDoctorEmail = async (symptoms, description, riskLevel) => {
  try {
    console.log("📧 Attempting to send email...");
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("DOCTOR_EMAIL:", process.env.DOCTOR_EMAIL);
    console.log("EMAIL_PASS set:", !!process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify connection first
    await transporter.verify();
    console.log("✅ SMTP connection verified");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.DOCTOR_EMAIL,
      subject: "Patient Recovery Alert",
      text: `
Patient reported symptoms.

Symptoms: ${symptoms.join(", ")}

Description:
${description}

Risk Level: ${riskLevel}

Please review patient condition.
`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);

  } catch (error) {
    console.error("❌ Email error:", error.message);
  }
};