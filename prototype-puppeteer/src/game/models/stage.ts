export type StageParams = {
  name: string;
  description: string;
  days: number;
  challenges: string[];
};

export class Stage {
  public name: string;
  public description: string;
  public days: number;
  public challenges: string[];

  constructor({ name, description, days, challenges }: StageParams) {
    this.name = name;
    this.description = description;
    this.days = days;
    this.challenges = challenges;
  }
}
