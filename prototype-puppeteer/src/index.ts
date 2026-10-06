import { Puppeteer } from "./game/puppeteer.js";

async function main() {
  console.log("STARTING PUPPETEER!");

  const puppeteer = new Puppeteer("http://localhost:3000");
  await puppeteer.bootstrap();

  const allMembers = await puppeteer.getAllMembers();
  if (allMembers.length !== 0) {
    console.log(allMembers.length);
    console.log(allMembers[0]);
  }
}

main();
