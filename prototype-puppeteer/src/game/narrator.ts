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
      They have accepted IFS as the new form of government where their freedom is not taken away and they do not have to fight back and pay with blood to take it back again.`,
    days: 150,
    challenges: [
      `1. Public safety and security:
        Who maintains order now that the previous regime is gone?
          - Are the police still functioning?
          - Who controls the military and its weapons?
          - Are armed groups competing for control?
          - Who protects people from violence, theft, and retaliation?
          - What prevents another powerful group from seizing control?
        Security is especially complicated because the institutions responsible for maintaining it may be the same institutions that previously oppressed the population.`,
      `2. Continuity of essential services
        People still need electricity, water, hospitals, food, transportation, and sanitation.
        Consider a hospital. Yesterday, it operated under the old government. Today, the government has collapsed.
        Does its funding continue? Who pays its employees? Who is authorized to make decisions?
        The hospital cannot simply stop operating while people figure out the new political system.`,
      `3. Economic stability
        A revolution can disrupt economic activity even when much of the country's infrastructure remains intact.
        People may face unemployment, inflation, shortages, banking disruptions, and uncertainty over contracts.
        For ordinary citizens, the immediate question may be less about political philosophy and more about whether they can afford food tomorrow.`,
      `4. Preventing revenge and collective punishment
        After years of repression, some people may demand punishment for officials, police officers, or people associated with the old regime.
        But how do you distinguish perpetrators from ordinary employees who simply worked for the government?
        How do you deliver justice without replacing one form of arbitrary punishment with another?
        This is the problem of transitional justice.`,
      `5. The authority vacuum
        The old government has disappeared, but who has legitimate authority today?
        Suppose there is a dispute between two cities about access to water.
        Who resolves it?
        Or suppose thousands of people want to establish a new public institution.
        Who has the authority to establish it, what procedures must they follow, and how can others challenge that decision?
        You cannot simply assume that accepting IFS automatically answers those questions.`,
      `6. Defining the rules of the new system
        People might agree on the principle of individual freedom while disagreeing profoundly about what freedom means in practice.
        For example:
        - Does an individual have the right to own a river?
        - Can a community prohibit certain activities in its territory?
        - What happens when one person's freedom interferes with another's?
        - Which decisions can be made by a majority, and which individual rights cannot be overridden?
        These aren't merely philosophical questions. They eventually determine who can do what in the real world.`,
      `7. Rebuilding trust
        Imagine someone who spent 30 years living under a government that punished political disagreement.
        Now they're told they can participate freely in public decisions.
        Would they immediately trust that promise?
        Perhaps not.
        People may distrust institutions, other political groups, and even their neighbors.
        And trust cannot be established merely by declaring a new governing system.`,
      `8. Learning how to participate
        This is something I think deserves special attention in IFS.
        Under authoritarian rule, many people become accustomed to political decisions being made for them.
        Now they may have responsibilities they never previously exercised.
        For example, they may need to evaluate proposals, participate in forums, select delegates, question authorities, or resolve disagreements through peaceful procedures.
        But participation takes time, information, and practice.
        There is also an important problem of inequality: people with more money, education, free time, or organizational experience may dominate participation unless the system accounts for those differences.`,
    ],
  }),
];
