import passport from "passport";
import local from "passport-local";
import { usersModel } from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";

const localStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name } = req.body;

          if (username === "adminCoder@coder.com") {
            console.log("Not authorized");
            return done(null, false);
          }

          const user = await usersModel.findOne({ email: username });
          if (user) {
            console.log("User already exists");
            return done(null, false);
          }

          const newUser = {
            first_name,
            last_name,
            email: username,
            password: createHash(password),
          };
          const result = await usersModel.create(newUser);
          done(null, result);
        } catch (error) {
          console.error(error);
          done(`Error register: ${error}`);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await usersModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
