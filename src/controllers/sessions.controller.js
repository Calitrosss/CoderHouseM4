import UsersDTO from "../dao/dto/users.dto.js";
import { googleSendSimpleMail } from "../utils/mailing.js";

import { userModel } from "../dao/models/user.model.js";
import { createHash } from "../utils/bcrypt.js";

export const postRegister = (req, res) => {
  res.redirect("/login");
};

export const postLogin = (req, res) => {
  if (!req.user) {
    req.logger.info(`${new Date().toLocaleString()} => Error with credentials`);
    return res.redirect("/failtologin");
  }

  req.session.user = {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    age: req.user.age,
    cart: req.user.cart,
    role: req.user.role,
  };

  res.redirect("/");
};

export const postLogout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: err });
    });
    res.send({ redirect: "http://localhost:8080/login" });
  } catch (error) {
    req.logger.error(`${new Date().toLocaleString()} => ${error}`);
    res.status(400).send({ error: `${error}` });
  }
};

export const getGitHubCallback = (req, res) => {
  req.session.user = req.user;
  res.redirect("/");
};

export const getCurrent = (req, res) => {
  try {
    if (!req.session.user) return res.status(401).send({ error: "Error with credentials" });
    res.send(new UsersDTO(req.session.user));
  } catch (error) {
    req.logger.error(`${new Date().toLocaleString()} => ${error}`);
    res.status(400).send({ error: `${error}` });
  }
};

export const sendResetPassLink = async (req, res) => {
  try {
    const { email } = req.body;

    await googleSendSimpleMail({
      from: "eCommerce",
      to: email,
      subject: "eCommerce - Restablecer contraseña",
      html: `
      Por favor ingresa a este link para que puedas reestablecer tu contraseña: <a href="http://localhost:8080/reset-pass" target="_blank" rel="noopener noreferrer">LINK</a>
      `,
    });

    res.redirect("/login");
  } catch (error) {
    req.logger.error(`${new Date().toLocaleString()} => ${error}`);
    res.redirect("/forgot-pass");
  }
};

export const putResetPass = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (user) {
      await userModel.updateOne({ _id: user._id }, { password: createHash(password) });
    }

    res.send({ status: "success", message: "OK" });
  } catch (error) {
    req.logger.error(`${new Date().toLocaleString()} => ${error}`);
    res.status(400).send({ status: "error", error: `${error}` });
  }
};
