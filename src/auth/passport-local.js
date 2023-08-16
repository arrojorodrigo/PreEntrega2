
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

import { Strategy as LocalStrategy } from "passport-local";
import MongoDBUsers from "../dao/mongo/MongoDBUsers.js";
import { MongoDBCarts } from "../daos/mongo/MongoDBCarts.js";
import { encryptPassword, comparePassword } from "../config/bcrypt.js";
const db = new MongoDBUsers();
const dbCarts = new MongoDBCarts();

const localStrategy = LocalStrategy;
const githubStrategy = GitHubStrategy;

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

passport.use(
  "register",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const usuarioSaved = await db.getUserByEmail({ email });
      if (usuarioSaved) {
        req.flash(
          "error",
          "user already exists"
        );
        return done(null, false);
      } else {
        const hashPass = await encryptPassword(password);
        const newCart = await dbCarts.create();
        const newUser = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          age: req.body.age,
          cart: newCart._id,
          password: hashPass,
          role: req.body.role || "user",
        };
        const response = await db.create(newUser);
        console.log("New user registered ", response);
        return done(null, response);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {    // callback 

      const usuarioSaved = await db.getUserByEmail({ email });
      if (!usuarioSaved) {
        req.flash(
          "error",
          "this user does not exist"
        );
        return done(null, false);
      }
      const isTruePassword = await comparePassword(
        password,
        usuarioSaved.password
      );
      if (!isTruePassword) {
        req.flash(
          "error",
          "Incorrect password"
        );
        return done(null, false);
      }

      return done(null, usuarioSaved);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);                 ///mongo id
});

passport.deserializeUser(async (id, done) => {
  const user = await db.getOne(id);
  done(null, user);
});

function isAuth(req, res, next) {        //mildware 

  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
};

export { passport, isAuth };