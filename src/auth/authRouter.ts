import { Router } from "express";
import { json } from "body-parser";
import passport from "passport";

const authRouter = Router();

authRouter.use(json());

authRouter.post("/login", passport.authenticate("local"), (req, res) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.send(401);
  }
});

export default authRouter;
