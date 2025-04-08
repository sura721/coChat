import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"
import dotenv from "dotenv"
export const generateToken = (userId, res) => {
  const token = jwt.sign(
    { userId },
    process.env.ACCESS_TOKEN,
    { expiresIn: '1d' }
  );

  res.cookie('jwt', token, {
    maxAge: 1 * 24 * 60 * 60 * 1000, 
    httpOnly: true, 
    sameSite: 'strict',
    secure: process.env.NODE_ENV !== 'development' 
  });

  return token;
};

dotenv.config()
const transporter = nodemailer.createTransport({
  service:'gmail',
  auth:{
    user:process.env.GOOGLE_USER_EMAIL,
    pass:process.env.GOOGLE_USER_PASS
  }
})

export async function sendOTP(email, verificationCode) {
  const mailOptions = {
    from:process.env.GOOGLE_USER_EMAIL,
    to: email,
    subject: 'Your coChat OTP Code',
    html: `
    <div style="font-family: sans-serif; line-height: 1.6;">
        <h2>Welcome to Our chat App!</h2>
        <p>use the following code on coChat to verify your email address:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #333;">
            ${verificationCode}
        </p>
        <p>If you did not sign up for this account, you can ignore this email.</p>
    </div>
`,
  };
  return transporter.sendMail(mailOptions);
}

export const generateUsername = (name) => {
  let base = name.toLowerCase().replace(/\s+/g, '');

  if (base.length < 4) {
    base = base + 'user';
  }

  return base + Math.floor(Math.random() * 10000);
};
