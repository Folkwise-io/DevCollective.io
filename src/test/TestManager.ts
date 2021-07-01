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
  private agent: MbQueryAgent;
  constructor(private app: Express) {
    this.agent = query(this.app);
  }

  login(email: any, password: any, agent = this.agent): supertest.Test {
    return agent.post(`/auth/login`, {
      email,
      password,
    });
  }

  // these are "any" type to accommodate various bad data in some of the tests

  register(opts: RegisterParams, agent = this.agent) {
    const { firstName, lastName, email, password } = opts;

    const res = agent.post(`/auth/register`, {
      firstName,
      lastName,
      email,
      password,
    });
    res.then((res) => console.log(res.body.errors));

    return res;
  }

  submitAccountConfirmationToken(opts: SubmitAccountConfirmationTokenParams, agent = this.agent) {
    const { confirmationToken, email } = opts;
    return agent.get(`/auth/confirmAccount`).query({ confirm: confirmationToken, email });
  }

  forgotRequest(email: string, agent = this.agent) {
    return agent.post(`/auth/forgot/request`, { email });
  }
  forgotConfirm(payload: any, agent = this.agent) {
    return agent.post(`/auth/forgot/confirm`, payload);
  }

  check(agent = this.agent) {
    return agent.post(`/auth/check`);
  }

  logout(agent = this.agent) {
    return agent.post(`/auth/logout`);
  }

  raw() {
    return this.agent;
  }

  fork(): TestManager {
    return new TestManager(this.app);
  }

  gql(query: string, variables?: any, agent = this.agent) {
    return agent.post(`/graphql`, { query, variables });
  }
}
