import type { MemberResponseDto } from 'prototype-client';
import type { Personality } from './personality.js';

export class Puppet {
  constructor(
    public member: MemberResponseDto,
    public personality: Personality
  ) {}

  get name(): string {
    return this.member.name;
  }

  get id(): string {
    return this.member.id;
  }

  get ifsId(): string {
    return this.member.id;
  }
}
