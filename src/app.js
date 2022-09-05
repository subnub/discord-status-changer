import puppeteer from "puppeteer-extra";
import pluginStealth from "puppeteer-extra-plugin-stealth";
import passwordPrompt from "password-prompt";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import * as dotenv from "dotenv";
import cron from "node-cron";
import list from "./list.js";
import wait from "./utils/wait.js";

dotenv.config();

puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: "2captcha",
      token: process.env.api_token,
      method: "hcaptcha",
    },
    visualFeedback: true,
  })
);

const setCustomStatus = async (password) => {
  const randomListPick = list[Math.floor(Math.random() * list.length)];

  console.log("Randomly Selected Phrase", randomListPick);

  puppeteer.use(pluginStealth());
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://discord.com/login", { waitUntil: "networkidle2" });

  await page.type('input[type="text"]', process.env.email);
  await page.type('input[type="Password"]', password);
  await page.click('button[type="submit"]');

  await wait();

  await page.solveRecaptchas();

  await wait();
  await page.click(".nameTag-sc-gpq");

  await page.waitForSelector("#account-edit-custom-status");
  await page.click("#account-edit-custom-status");

  await page.waitForSelector(".clearIcon-oT7WrW");
  await page.click(".clearIcon-oT7WrW");

  await page.type('input[placeholder="Support has arrived!"]', randomListPick);

  await page.click(".lookFilled-yCfaCM");

  await browser.close();

  console.log("Set New Status");
};

const main = async () => {
  const password = await passwordPrompt("Password: ", { method: "hide" });

  cron.schedule("30 * * * * *", async () => {
    console.log("Starting Cron Task...");
    await setCustomStatus(password);
    console.log("Cron Task Finished\n");
  });
};

main();
