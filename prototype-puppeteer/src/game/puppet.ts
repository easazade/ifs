import type { MemberResponseDto } from 'prototype-client';
import { personalities } from '../fake/personalities.js';
import type { Personality } from './personality.js';

export class Puppet {
  personality: Personality;

  constructor(public member: MemberResponseDto) {
    this.personality = personalities[Number(member.id)]!;
  }

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
