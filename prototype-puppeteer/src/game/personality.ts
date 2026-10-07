import type { FormativeExperience } from '../generation/pools/formative-experiences.js';
import type { Trait } from '../generation/pools/trait-pool.js';
import type { Worldview } from '../generation/pools/worldview-pool.js';

// Composition preserves each selected pool object's type and boundary.
export type PersonalityParameters = {
  formativeExperiences: FormativeExperience[];
  traits: Trait[];
  worldview: Worldview;
};

export class Personality implements PersonalityParameters {
  public formativeExperiences: FormativeExperience[];
  public traits: Trait[];
  public worldview: Worldview;

  constructor(parameters: PersonalityParameters) {
    this.formativeExperiences = parameters.formativeExperiences;
    this.traits = parameters.traits;
    this.worldview = parameters.worldview;
  }
}
