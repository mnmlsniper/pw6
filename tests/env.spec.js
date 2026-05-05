import fs from "fs";
import { test } from "../src/helpers/fixtures/fixture";
import { expect } from "@playwright/test";

const getToken = () => {
  return (
    process.env.AUTH_TOKEN ||
    JSON.parse(fs.readFileSync("auth-token.json", "utf-8")).key
  );
};

test.only("Получить токен доступа facade", async ({ api }) => {
  console.log(process.env.time);
  const token = getToken();
  const response = await api.challenges.get(token);

  expect(response.challenges.length).toEqual(59);
});
