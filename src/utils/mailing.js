import nodemailer from "nodemailer";

import { getVariables } from "../config/dotenv.config.js";
const { googleAppEmail, googleAppPass } = getVariables();

const googleEmailTransport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: googleAppEmail,
    pass: googleAppPass,
  },
});

const googleSendSimpleMail = async ({ from, to, subject, html, attachments = [] }) => {
  try {
    const result = await googleEmailTransport.sendMail({
      from,
      to,
      subject,
      html,
      attachments,
    });

    return { status: "sucess", result };
  } catch (error) {
    return { status: "error", error: `${error}` };
  }
};

export default googleSendSimpleMail;
