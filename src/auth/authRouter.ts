import { Router } from "express";
import { json } from "body-parser";
import { checkPassword } from "../service/UserService";

const authRouter = Router();

authRouter.use(json());

authRouter.post("/login", async (req, res) => {
  const email: string = req.body.email;
  const password: string = req.body.password;

  const user = await checkPassword({ email, password });

  if (req.session && user) {
    req.session.user = user;
    return res.send(user);
  } else {
    return res.sendStatus(401);
  }
});

authRouter.post("/logout", async (req, res) => {
  if (req.session) {
    req.session.user = null;
  }
  return res.sendStatus(200);
});

authRouter.post("/check", async (req, res) => {
  if (req.session?.user) {
    return res.json(req.session.user);
  } else {
    return res.sendStatus(401);
  }
});

export default authRouter;
