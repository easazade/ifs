import { logger } from '../utils/logger.js';
import type { Agent } from './agent.js';
import { Stage } from './models/stage.js';
import type { Puppeteer } from './puppeteer.js';

const days = 1;

export class Narrator {
  constructor(
    private puppeteer: Puppeteer,
    private agent: Agent
  ) {}

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

const stages: Stage[] = [
  new Stage({
    name: 'Gates of Freedom',
    description: `People have just ended the reign of a tyrannical regime. 
      They have accepted IFS as the new form of government where their freedom is not taken away and they do not have to fight back and pay with blood to take it back`,
    days: 150,
  }),
];
