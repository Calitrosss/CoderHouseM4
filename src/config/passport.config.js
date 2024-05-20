import passport from "passport";
import local from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";

import { getVariables } from "../config/dotenv.config.js";
const { adminEmail, adminPassword, githubClientId, githubClientSecret, githubCallbackUrl } =
  getVariables();

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
          const { first_name, last_name, age } = req.body;

          if (username === adminEmail) {
            console.log("Not authorized");
            return done(null, false);
          }

          const user = await userModel.findOne({ email: username });
          if (user) {
            console.log("User already exists");
            return done(null, false);
          }

          const newUser = {
            first_name,
            last_name,
            email: username,
            age,
            password: createHash(password),
          };
          const result = await userModel.create(newUser);
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

        if (username === adminEmail) {
          if (password !== adminPassword) {
            console.log("Invalid password");
            return done(null, false);
          }

          user = {
            _id: "adminCoder",
            first_name: "Admin",
            last_name: "Coder",
            email: username,
            age: 0,
            password: createHash(password),
            cart: null,
            role: "admin",
          };
        } else {
          user = await userModel.findOne({ email: username });
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

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: githubClientId,
        clientSecret: githubClientSecret,
        callbackURL: githubCallbackUrl,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // console.log({ profile });

          const user = await userModel.findOne({ email: profile._json.email });

          if (!user) {
            const newUser = {
              first_name: profile._json.name.split(" ")[0] || "(FirstName)",
              last_name: profile._json.name.split(" ")[1] || "(LastName)",
              email: profile._json.email,
              password: createHash("*GitHubGeneratedPassword*"),
            };

            const result = await userModel.create(newUser);

            result.password = "";
            return done(null, result);
          }

          user.password = "";
          done(null, user);
        } catch (error) {
          console.error(`${error}`);
          done(`Error: ${error}`);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = {};

    if (id === "adminCoder") {
      user = {
        _id: "admin",
        first_name: "Admin",
        last_name: "Coder",
        email: "adminCoder@coder.com",
        age: null,
        cart: null,
        role: "admin",
      };
    } else {
      user = await userModel.findById(id);
    }
    done(null, user);
  });
};

export default initializePassport;
