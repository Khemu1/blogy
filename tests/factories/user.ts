import { faker } from "@faker-js/faker";

export const returnNewUser = () => {
  const fakeUsername =
    new Date().getTime() +
    `${faker.person.firstName()}${faker.person.lastName()}`;
  const fakeEmail = new Date().getTime() + faker.internet.email();
  const fakePassword = faker.internet.password({ length: 12 });

  const user = {
    username: fakeUsername,
    email: fakeEmail,
    password: fakePassword,
    confirmPassword: fakePassword,
  };
  return user;
};
