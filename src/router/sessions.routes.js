import { Router } from "express";
import { usersModel } from "../dao/models/users.model.js";

const sessionsRoutes = Router();

sessionsRoutes.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, role, email, password } = req.body;

    const user = await usersModel.create({ first_name, last_name, role, email, password });

    // res.status(201).send({ user });
    req.session.user = user;
    res.redirect("/");
  } catch (error) {
    console.error(`${error}`);
    res.status(400).send({ error: `${error}` });
  }
});

sessionsRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usersModel.findOne({ email });

    if (!user) return res.status(404).json({ message: "Not found" });

    if (user.password !== password) return res.status(401).json({ error: "Invalid password" });

    req.session.user = user;

    res.redirect("/");
  } catch (error) {
    console.error(`${error}`);
    res.status(400).send({ error: `${error}` });
  }
});

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
