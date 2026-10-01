import type { FormativeExperience } from "../generation/pools/formative-experiences.js";
import type { Trait } from "../generation/pools/trait-pool.js";
import type { Worldview } from "../generation/pools/worldview-pool.js";

export type PersonalityParameters = FormativeExperience &
  Omit<Trait, "valence"> &
  Worldview;

export class Personality implements FormativeExperience, Trait, Worldview {
  declare public id: FormativeExperience["id"];
  declare public valence: FormativeExperience["valence"];
  declare public title: FormativeExperience["title"];
  declare public domain: FormativeExperience["domain"];
  declare public life_stages: FormativeExperience["life_stages"];
  declare public exposure_pattern: FormativeExperience["exposure_pattern"];
  declare public experience: FormativeExperience["experience"];
  declare public possible_meanings: FormativeExperience["possible_meanings"];
  declare public reminder_cues: FormativeExperience["reminder_cues"];
  declare public possible_initial_responses: FormativeExperience["possible_initial_responses"];
  declare public possible_decision_tendencies: FormativeExperience["possible_decision_tendencies"];
  declare public moderating_factors: FormativeExperience["moderating_factors"];
  declare public alternative_outcome: FormativeExperience["alternative_outcome"];
  declare public source_ids: FormativeExperience["source_ids"];
  declare public name: Trait["name"];
  declare public level: Trait["level"];
  declare public effect: Trait["effect"];
  declare public viewOfPeople: Worldview["viewOfPeople"];
  declare public viewOfSelf: Worldview["viewOfSelf"];
  declare public viewOfLife: Worldview["viewOfLife"];
  declare public beliefAboutGodAndAfterlife: Worldview["beliefAboutGodAndAfterlife"];

  constructor(parameters: PersonalityParameters) {
    // Object assignment keeps construction concise while declarations preserve static types.
    Object.assign(this, parameters);
  }
}
