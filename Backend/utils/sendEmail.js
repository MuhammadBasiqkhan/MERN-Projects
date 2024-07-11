const nodemailer = require("nodemailer")

const sendEmail = async (options) => { 

    const transporter = nodemailer.createTransport({
        host: process.env.SERVER_HOST,
        port: process.env.SERVER_PORT,
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SECRET_GOOGLE_EMAIL,
            pass: process.env.SECRET_GOOGLE_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SECRET_GOOGLE_EMAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
      
    };

    await transporter.sendMail(mailOptions);
    
 }

 module.exports = sendEmail
