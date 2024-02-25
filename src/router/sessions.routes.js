import { Router } from "express";
import passport from "passport";
import {
  postRegister,
  postLogin,
  postLogout,
  getGitHubCallback,
  getCurrent,
} from "../controllers/sessions.controller.js";

const sessionsRoutes = Router();

sessionsRoutes.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failtoregister" }),
  postRegister
);

sessionsRoutes.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/failtologin" }),
  postLogin
);

sessionsRoutes.post("/logout", postLogout);

sessionsRoutes.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

sessionsRoutes.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  getGitHubCallback
);

sessionsRoutes.get("/current", getCurrent);

export default sessionsRoutes;
