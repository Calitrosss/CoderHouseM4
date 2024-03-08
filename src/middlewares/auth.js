export const chekAuth = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");

  next();
};

export const checkUser = (req, res, next) => {
  if (req.session.user) return res.redirect("/");

  next();
};

export const isAdmin = (req, res, next) => {
  if (req.session.user?.role !== "admin") return res.status(403).send("<h1>Forbidden</h1>");

  next();
};

export const isUser = (req, res, next) => {
  if (req.session.user?.role !== "user") return res.status(403).send("<h1>Forbidden</h1>");

  next();
};
