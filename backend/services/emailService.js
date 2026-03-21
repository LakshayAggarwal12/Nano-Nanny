const nodemailer = require("nodemailer");

exports.sendDoctorEmail = async (symptoms, description, riskLevel) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.DOCTOR_EMAIL) {
      console.log("⚠️ Email env vars not set — skipping email");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });


    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.DOCTOR_EMAIL,
      subject: "Patient Recovery Alert",
      text: `
Patient reported symptoms.
Symptoms: ${symptoms.join(", ")}
Description: ${description}
Risk Level: ${riskLevel}
Please review patient condition.
`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);

  } catch (error) {
    console.error("❌ Email error:", error.message);
  }
};
