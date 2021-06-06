import faker from "faker";
import { autoIncrement } from "../utils";

export const nextUserId = autoIncrement();

export default function userFactory(): DUser {
  return {
    id: nextUserId(),
    email: faker.unique(() => faker.internet.email()),
    passwordHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.", // "password"
    confirmationTokenHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.", // also "password" for convenience
    forgotPasswordTokenHash: null,
    forgotPasswordExpiry: null,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    createdAt: faker.date.past(),
    updatedAt: new Date(),
  };
}
