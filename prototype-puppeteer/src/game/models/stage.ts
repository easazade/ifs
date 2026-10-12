export type StageParams = {
  name: string;
  description: string;
  days: number;
};

export class Stage {
  public name: string;
  public description: string;
  public days: number;

  constructor({ name, description, days }: StageParams) {
    this.name = name;
    this.description = description;
    this.days = days;
  }
}
