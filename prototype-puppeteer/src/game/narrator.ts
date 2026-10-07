import { logger } from '../utils/logger.js';
import type { Puppeteer } from './puppeteer.js';

const days = 60;

export class Narrator {
  constructor(private puppeteer: Puppeteer) {}

  async run(): Promise<void> {
    for (let i = 1; i <= days; i++) {
      const day = i;
      logger.info(`------------- Day ${day} -------------`);
      const puppets = await this.puppeteer.getAllPuppets();

      for (const puppet of puppets) {
        logger.info(`Narrating for member [${puppet.name}]`);
        // TODO - Get the GLOBAL events scoped for this member. user should make a decision of available decisions in puppeteer.
        // code should be like puppeteer.createObservationEvent(...)
        // TODO - Get the PERSONAL events scoped for this member. user should make a decision of available decisions in puppeteer.
        // code should be like puppeteer.createObservationEvent()
        // or maybe something like
        // code should be like puppeteer.reportProblem()
        // code should be like puppeteer.createChangeProposal()
        // TODO - Get the changes/proposals scoped for this member. user should make a decision of available decisions in puppeteer.
        // TODO - Do work
        // puppeteer - create work report
      }
    }
  }
}
