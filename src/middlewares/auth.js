export const chekAuth = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");

  next();
};

export const checkUser = (req, res, next) => {
  if (req.session.user) return res.redirect("/");

  next();
};

export const authorization = (role) => {
  return async (req, res, next) => {
    if (req.session.user?.role !== role) return res.status(403).send("<h1>Forbidden</h1>");

    next();
  };
};

export const applyPolicy = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.session.user?.role)) return res.status(403).send("<h1>Forbidden</h1>");

    next();
  };
};
