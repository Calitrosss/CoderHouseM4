import { Router } from "express";
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
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
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

sessionsRoutes.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

sessionsRoutes.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

sessionsRoutes.get("/current", async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).send({ error: "Error with credentials" });

    res.send(req.session.user);
  } catch (error) {
    console.error(`${error}`);
    res.status(400).send({ error: `${error}` });
  }
});

export default sessionsRoutes;
