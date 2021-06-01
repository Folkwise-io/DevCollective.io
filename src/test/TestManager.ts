import { Express } from "express";
import supertest from "supertest";
import query, { MbQueryAgent } from "./query";

interface RegisterParams {
  firstName: string | any;
  lastName: string | any;
  email: string | any;
  password: string | any;
}

interface SubmitAccountConfirmationTokenParams {
  confirmationToken: string | any;
  email: string | any;
}

export default class TestManager {
  private agent?: MbQueryAgent;
  constructor(private app: Express) {}
  getAgent(): MbQueryAgent {
    if (!this.agent) {
      this.agent = query(this.app);
    }

    return this.agent;
  }

  login(email: any, password: any, agent?: MbQueryAgent): supertest.Test {
    const _agent = agent || this.getAgent();

    return _agent.post("/auth/login", {
      email,
      password,
    });
  }

  // these are "any" type to accommodate various bad data in some of the tests

  register(opts: RegisterParams, agent?: MbQueryAgent) {
    const _agent = agent || this.getAgent();
    const { firstName, lastName, email, password } = opts;

    return _agent.post("/auth/register", {
      firstName,
      lastName,
      email,
      password,
    });
  }

  submitAccountConfirmationToken(opts: SubmitAccountConfirmationTokenParams, agent?: MbQueryAgent) {
    const _agent = agent || this.getAgent();
    const { confirmationToken, email } = opts;
    return _agent.get("/auth/confirmAccount").query({ confirm: confirmationToken, email });
  }

  forgotRequest(email: string, agent?: MbQueryAgent) {
    const _agent = agent || this.getAgent();
    return _agent?.post("/auth/forgot/request", { email });
  }
  forgotConfirm(payload: any, agent?: MbQueryAgent) {
    const _agent = agent || this.getAgent();
    return _agent?.post("/auth/forgot/confirm", payload);
  }

  check(agent?: MbQueryAgent) {
    const _agent = agent || this.getAgent();
    return _agent.post("/auth/check");
  }

  fork(): TestManager {
    return new TestManager(this.app);
  }
}
