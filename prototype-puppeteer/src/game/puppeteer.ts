import { fakeMembers } from '../fake/ifs/members.js';
import { logger } from '../utils/logger.js';
import type { Api } from './api.js';
import { Puppet } from './puppet.js';

export type PuppeteerParams = {
  baseUrl: string;
  api: Api;
};
export class Puppeteer {
  private api: Api;

  constructor({ api, baseUrl }: PuppeteerParams) {
    this.api = api;
    this.api.setApiBaseUrl(baseUrl);
  }

  async bootstrap(): Promise<boolean> {
    try {
      logger.info('Puppeteer is trying to bootstrap the server...');
      if (!(await this.api.hello())) {
        logger.warn('Server is not responsive!');
        return false;
      }
      const members = await this.api.listMembers();
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

  async getAllPuppets(): Promise<Puppet[]> {
    return await this.api.listMembers().then((members) => members.map((member) => new Puppet(member)));
  }

  private async registerAllMembers(): Promise<void> {
    await Promise.all(fakeMembers.map((member) => this.api.createMember(member)));
  }
}
