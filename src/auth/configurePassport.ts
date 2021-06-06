import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserById } from "../data/UserRepo";
import { checkPassword } from "../service/UserService";

export default () => {
  passport.use(
    "local",
    new LocalStrategy(async function (username, password, done) {
      const FAILURE_MESSAGE = "No matching username or password found!";

      try {
        const user = await checkPassword({
          email: username,
          password,
        });

        if (user) {
          done(null, user);
        } else {
          done(FAILURE_MESSAGE);
        }
      } catch (e) {
        console.error("Error duing login: ", e);
        done(FAILURE_MESSAGE);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id: number, done) => {
    getUserById(id)
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });
};
