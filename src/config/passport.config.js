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
          done(`Error: ${error}`);
        }
      }
    )
  );

  passport.use(
    "login",
    new localStrategy({ usernameField: "email" }, async (username, password, done) => {
      try {
        let user = {};

        if (username === "adminCoder@coder.com") {
          if (password !== "adminCod3r123") {
            console.log("Invalid password");
            return done(null, false);
          }

          user = {
            _id: "adminCoder",
            first_name: "Admin",
            last_name: "Coder",
            role: "admin",
            email: username,
            password: createHash(password),
          };
        } else {
          user = await usersModel.findOne({ email: username });
        }

        if (!user) {
          console.log("User doesn't exists");
          return done(null, false);
        }

        if (!isValidPassword(user, password)) {
          console.log("Incorrect password");
          return done(null, false);
        }

        done(null, user);
      } catch (error) {
        console.error(error);
        done(`Error: ${error}`);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = {};
    if (id === "adminCoder") {
      user = {
        first_name: "Admin",
        last_name: "Coder",
        role: "admin",
        email: "adminCoder@coder.com",
      };
    } else {
      user = await usersModel.findById(id);
    }
    done(null, user);
  });
};

export default initializePassport;
