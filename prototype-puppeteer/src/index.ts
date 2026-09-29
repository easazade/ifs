import { exit } from "process";
import { Puppeteer } from "./puppeteer.js";

async function main() {
  console.log("STARTING!!!!!");

  const puppetter = new Puppeteer("http://localhost:3000");
  if (!(await puppetter.getHello())) {
    exit(-1);
  }
  const allMembers = await puppetter.getAllMembers();
  console.log(allMembers);
}

main();
