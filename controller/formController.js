import userSchema from "../model/formSchema.js";
import sendEmail from "../utils/sendEmail.js";

export const save = async (req, res) => {
  try {
    const { name, mobile, address, email } = req.body;
console.log("REQ BODY:", req.body);

    // 1. Save to DB
    const user = await userSchema.create({ name, mobile, address, email });

    // 2. Email to Admin
    await sendEmail(
      process.env.GMAIL_USER,
      "New Form Submission",
      `
       <div style="font-family: Arial, sans-serif; background: #eef2f7; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 14px; padding: 30px;
             box-shadow: 0 4px 18px rgba(0,0,0,0.1); border: 1px solid #d7d7d7;">
          
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://cdn-icons-png.flaticon.com/512/561/561127.png" width="70" />
            <h2 style="color: #1b63ff; margin: 10px 0 0; font-size: 24px;">
              New Connection Request
            </h2>
          </div>

          <div style="padding: 10px 0;">
            <p style="font-size: 17px; color:#333;">
              <strong>Name:</strong> ${name}
            </p>
            <p style="font-size: 17px; color:#333;">
              <strong>Phone:</strong> ${mobile}
            </p>
            <p style="font-size: 17px; color:#333;">
              <strong>Address:</strong> ${address}
            </p>
            <p style="font-size: 17px; color:#333;">
              <strong>Email:</strong> ${email}
            </p>
          </div>

          <hr style="border-top: 1px solid #ddd; margin: 25px 0;">

          <p style="font-size: 13px; color:#666; text-align:center;">
            Automated message — Do not reply.<br>
            © Hathway Indore — All Rights Reserved.
          </p>

        </div>
      </div>
      `
    );

    // 3. Confirmation Email to User (NEW)
    await sendEmail(
      email,
      "Your Request Has Been Received",
      `
        <div style="font-family: Arial; padding: 20px; background: #f7f9fc;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 25px;
                      border-radius: 12px; box-shadow: 0 3px 12px rgba(0,0,0,0.08);">
            
            <h2 style="color: #1b63ff;">Thank You, ${name}!</h2>
            <p>Your connection request has been successfully submitted.</p>
            <p>Our team will contact you shortly on your phone or email.</p>

            <hr style="border-top: 1px solid #ddd; margin: 25px 0;">

            <p style="font-size: 13px; color:#777;">
              This is a confirmation for your submitted request.<br>
              © Hathway Indore
            </p>

          </div>
        </div>
      `
    );

    res.status(201).json({
      success: true,
      message: "Form saved & both emails sent!",
      user,
    });

  } catch (error) {
    // 1. Duplicate key (already exists) — treat as success for UX but we'll still notify admin and user.
    if (error && error.code === 11000) {
      // Try to still notify admin + user even when the DB rejects duplicate inserts
      try {
        const { name, mobile, address, email } = req.body;
        await sendEmail(
          process.env.GMAIL_USER,
          "New Form Submission (duplicate)",
          `A duplicate submission was received for ${email} — Name: ${name}, Phone: ${mobile}`
        );
        await sendEmail(
          email,
          "Your Request Has Been Received",
          `<p>Thanks, ${req.body.name}. We received your request again.</p>`
        );
      } catch (mailErr) {
        console.warn('Failed to send duplicate notification emails', mailErr.message || mailErr);
      }
      return res.status(201).json({ success: true, message: 'Duplicate entry: submission received', duplicate: true });
    }

    // 2. Validation errors (Mongoose)
    if (error && error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: Object.values(error.errors)[0].message });
    }

    // 3. Unknown errors
    return res.status(500).json({ success: false, error: error.message });
  }
};
