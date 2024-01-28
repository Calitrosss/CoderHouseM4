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

// sessionsRoutes.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     let user = {};

//     if (email === "adminCoder@coder.com") {
//       if (password !== "adminCod3r123") return res.status(401).json({ error: "Invalid password" });

//       user = {
//         first_name: "Admin",
//         last_name: "Coder",
//         role: "admin",
//         email,
//         password,
//       };
//     } else {
//       user = await usersModel.findOne({ email });
//     }

//     if (!user) return res.status(404).json({ message: "Not found" });

//     if (user.password !== password) return res.status(401).json({ error: "Invalid password" });

//     req.session.user = user;

//     res.redirect("/");
//   } catch (error) {
//     console.error(`${error}`);
//     res.status(400).send({ error: `${error}` });
//   }
// });

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
