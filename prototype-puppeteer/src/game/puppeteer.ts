import { createMember, listMembers, setApiBaseUrl, type MemberResponseDto } from 'prototype-client';

import { getHello as isResponsive } from 'prototype-client';
import { fakeMembers } from '../fake/members.js';
import { logger } from '../utils/logger.js';
import { Puppet } from './puppet.js';
export class Puppeteer {
  constructor(private baseUrl: string) {
    setApiBaseUrl(baseUrl);
  }

  async bootstrap(): Promise<boolean> {
    try {
      logger.info('Puppeteer is trying to bootstrap the server...');
      if (!(await isResponsive())) {
        return false;
      }
      const members = await this.getAllMembers();
      if (members.length !== 0) {
        logger.info('No members found. Trying to register All fake members into the server');
        await this.registerAllMembers();
      }

      logger.info('Puppeteer successfully bootstrapped');
      return true;
    } catch (error) {
      logger.error('Puppeteer Could not bootstrap server');
      logger.error(error);
      return false;
    }
  }

  async getHello(): Promise<boolean> {
    try {
      const response = await isResponsive();
      if (response.status === 200) {
        logger.info('Server is responsive');
      }
      return response.status === 200;
    } catch (error) {
      logger.warn('Server is NOT responsive');
      logger.error(error);
      return false;
    }
  }

  async getAllMembers(): Promise<MemberResponseDto[]> {
    const response = await listMembers();
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      return [];
    }
  }

  async getAllPuppets(): Promise<Puppet[]> {
    return await this.getAllMembers().then((members) => members.map((member) => new Puppet(member)));
  }

  private async registerAllMembers(): Promise<void> {
    await Promise.all(fakeMembers.map((member) => createMember(member)));
  }
}
