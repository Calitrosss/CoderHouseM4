import { Router } from "express";
import { usersModel } from "../dao/models/users.model.js";
import passport from "passport";

const sessionsRoutes = Router();

sessionsRoutes.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failtoregister" }),
  async (req, res) => {
    res.redirect("/login");
  }
);

sessionsRoutes.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/failtologin" }),
  async (req, res) => {
    if (!req.user) {
      console.error("Error with credentials");
      return res.redirect("/failtologin");
    }

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      role: req.user.role,
      email: req.user.email,
    };

    res.redirect("/");
  }
);

sessionsRoutes.post("/logout", async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: err });
    });

    res.send({ redirect: "http://localhost:8080/login" });
  } catch (error) {
    console.error(`${error}`);
    res.status(400).send({ error: `${error}` });
  }
});

export default sessionsRoutes;
