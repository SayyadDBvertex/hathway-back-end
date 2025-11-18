import userSchema from "../model/formSchema.js";
import sendEmail from "../utils/sendEmail.js";

export const save = async (req, res) => {
  try {
    const { name, mobile, address } = req.body;

    // 1. Save to DB
    const user = await userSchema.create({ name, mobile, address });

    // 2. Email Send
    await sendEmail(
     process.env.GMAIL_USER,
"New Form Submission",
`
 <div style="
  font-family: Arial, sans-serif;
  background: #eef2f7;
  padding: 30px;
">
  <div style="
    max-width: 600px;
    margin: auto;
    background: #ffffff;
    border-radius: 14px;
    padding: 30px;
    box-shadow: 0 4px 18px rgba(0,0,0,0.1);
    border: 1px solid #d7d7d7;
  ">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://cdn-icons-png.flaticon.com/512/561/561127.png" 
           width="70" alt="icon" />
      <h2 style="
        color: #1b63ff;
        margin: 10px 0 0;
        font-size: 24px;
      ">
        New Connection Request
      </h2>
    </div>

    <!-- Content Block -->
    <div style="padding: 10px 0;">
      
      <p style="font-size: 17px; color:#333; margin: 18px 0;">
        <img src="https://cdn-icons-png.flaticon.com/512/456/456212.png" 
        width="20" style="vertical-align:middle; margin-right:8px;" />
        <strong>Name:</strong> ${name}
      </p>

      <p style="font-size: 17px; color:#333; margin: 18px 0;">
        <img src="https://cdn-icons-png.flaticon.com/512/455/455705.png" 
        width="20" style="vertical-align:middle; margin-right:8px;" />
        <strong>Phone:</strong> ${mobile}
      </p>

      <p style="font-size: 17px; color:#333; margin: 18px 0;">
        <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" 
        width="20" style="vertical-align:middle; margin-right:8px;" />
        <strong>Address:</strong> ${address}
      </p>

    </div>

    <hr style="border:0; border-top: 1px solid #ddd; margin: 25px 0;">

    <!-- Footer -->
    <p style="
      font-size: 13px; 
      color:#666; 
      text-align:center;
    ">
      This is an automated message — please do not reply.<br>
      © Hathway Indore — All Rights Reserved.
    </p>

  </div>
</div>

`

    );

    res.status(201).json({
      success: true,
      message: "Form saved & email sent!",
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
