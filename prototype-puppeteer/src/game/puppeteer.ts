import {
  listMembers,
  setApiBaseUrl,
  type MemberResponseDto,
} from "prototype-client";

import { getHello as isResponsive } from "prototype-client";
import { logger } from "../utils/logger.js";
export class Puppeteer {
  constructor(private baseUrl: string) {
    setApiBaseUrl(baseUrl);
  }

  async getHello(): Promise<boolean> {
    try {
      const response = await isResponsive();
      if (response.status === 200) {
        logger.info("Server is responsive");
      }
      return response.status === 200;
    } catch (error) {
      logger.warn("Server is NOT responsive");
      logger.error(error);
      return false;
    }
  }

  async getAllMembers(): Promise<MemberResponseDto[]> {
    const response = await listMembers();
    if (response.status >= 200 && response.status < 300) {
      response.data.map((item) => {
        console.log(item.ifsId);
      });
      return response.data;
    } else {
      return [];
    }
  }
}
