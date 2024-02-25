import passport from "passport";
import local from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
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
          const { first_name, last_name, age } = req.body;

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
            age,
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
            email: username,
            age: 0,
            password: createHash(password),
            role: "admin",
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

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.b8cc1dfe39090414",
        clientSecret: "a953493d334f16c2ef5e2bf7e130c6ef2bab1f4e",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // console.log({ profile });

          const user = await usersModel.findOne({ email: profile._json.email });

          if (!user) {
            const newUser = {
              first_name: profile._json.name.split(" ")[0] || "(FirstName)",
              last_name: profile._json.name.split(" ")[1] || "(LastName)",
              email: profile._json.email,
              password: "*GitHubGeneratedPassword*",
            };

            const result = await usersModel.create(newUser);

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
        first_name: "Admin",
        last_name: "Coder",
        email: "adminCoder@coder.com",
        age: null,
        cart: null,
        role: "admin",
      };
    } else {
      user = await usersModel.findById(id);
    }
    done(null, user);
  });
};

export default initializePassport;
