import { exit } from 'node:process';
import { Api } from './game/api.js';
import { Narrator } from './game/narrator.js';
import { Puppeteer } from './game/puppeteer.js';
import { logger } from './utils/logger.js';

async function main() {
  console.log('STARTING PUPPETEER!');

  const puppeteer = new Puppeteer({ api: new Api(), baseUrl: 'http://localhost:3000' });
  const isGood = await puppeteer.bootstrap();
  if (!isGood) {
    logger.error('could not bootstrap server')
    exit(-1);
  }

  const narrator = new Narrator(puppeteer);
  await narrator.run();
}

main();
