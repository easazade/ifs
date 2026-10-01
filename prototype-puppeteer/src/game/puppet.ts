import type { MemberResponseDto } from "prototype-client";

export class Puppet {
  constructor(public member: MemberResponseDto) {}

  get name(): string {
    return this.member.name;
  }

  get id(): string {
    return this.member.id;
  }
}
