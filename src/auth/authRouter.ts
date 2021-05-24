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
    return res.send(401);
  }
});

authRouter.post("/logout", async (req, res) => {
  if (req.session) {
    req.session.user = null;
  }
  return res.send(200);
});

authRouter.get("/check", async (req, res) => {
  if (!req.session) {
    return res.send(401);
  } else {
    return res.send(req.session.user);
  }
});

export default authRouter;
