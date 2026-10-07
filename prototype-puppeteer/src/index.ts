import { Narrator } from './game/narrator.js';
import { Puppeteer } from './game/puppeteer.js';

async function main() {
  console.log('STARTING PUPPETEER!');

  const puppeteer = new Puppeteer('http://localhost:3000');
  await puppeteer.bootstrap();

  const narrator = new Narrator(puppeteer);
  await narrator.run();
}

main();
