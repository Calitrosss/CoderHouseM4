import UsersDTO from "../dao/dto/users.dto.js";

export const postRegister = (req, res) => {
  res.redirect("/login");
};

export const postLogin = (req, res) => {
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
};

export const postLogout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: err });
    });
    res.send({ redirect: "http://localhost:8080/login" });
  } catch (error) {
    console.error(`${error}`);
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
    console.error(`${error}`);
    res.status(400).send({ error: `${error}` });
  }
};
