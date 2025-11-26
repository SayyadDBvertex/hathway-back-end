import nodemailer from "nodemailer";

const sendEmail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // MUST BE TRUE for Gmail App Password
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // Your Gmail App Password
      },
    });
console.log("ADMIN EMAIL:", process.env.GMAIL_USER);

    await transporter.sendMail({
      from: process.env.GMAIL_USER, // SAME as auth user
      to,
      subject,
      html: message,
    });

    console.log("Email sent successfully!");
    
  } catch (error) {
    console.log("Email Error:", error.message);
  }
};

export default sendEmail;
