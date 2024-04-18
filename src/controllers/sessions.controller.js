import UsersDTO from "../dao/dto/users.dto.js";
import { googleSendSimpleMail } from "../utils/mailing.js";

import { userModel } from "../dao/models/user.model.js";
import { resetLinksModel } from "../dao/models/resetlinks.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";

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

export const getCurrent = async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).send({ error: "Error with credentials" });
    res.send(new UsersDTO(req.user));
  } catch (error) {
    req.logger.error(`${new Date().toLocaleString()} => ${error}`);
    res.status(400).send({ error: `${error}` });
  }
};

export const sendResetPassLink = async (req, res) => {
  try {
    const { email } = req.body;

    const findResetLink = await resetLinksModel.findOne({ email });

    if (findResetLink) await resetLinksModel.deleteOne({ _id: findResetLink._id });

    const resetId = await resetLinksModel.create({ email });

    const resetLink = `http://localhost:8080/reset-pass/${resetId._id.toString()}`;

    await googleSendSimpleMail({
      from: "eCommerce",
      to: email,
      subject: "eCommerce - Restablecer contraseña",
      html: `
      Por favor ingresa a este link para que puedas reestablecer tu contraseña (el link tiene 1 hora de validez): <a href="${resetLink}" target="_blank" rel="noopener noreferrer">LINK</a>
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
    const { rid } = req.params;
    const resetLink = await resetLinksModel.findOne({ _id: rid });

    if (!resetLink)
      return res.status(404).send({
        status: "error",
        error: `El link expiró, debe solicitar uno nuevo.`,
      });

    const email = resetLink.email;

    const { password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      throw new Error(`Usuario "${email}" no existe.`);
    }

    if (isValidPassword(user, password)) {
      return res.status(403).send({
        status: "error",
        error: `No puede usar la contraseña actual.`,
      });
    }

    await userModel.updateOne({ _id: user._id }, { password: createHash(password) });

    await resetLinksModel.deleteOne({ _id: rid });

    res.send({ status: "success", message: "OK" });
  } catch (error) {
    req.logger.error(`${new Date().toLocaleString()} => ${error}`);
    res.status(400).send({ status: "error", error: `${error}` });
  }
};
