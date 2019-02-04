import axios from 'axios';

import {Session} from './domain';

class ChalkClient {
  apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  CreateSession(): Promise<Session> {
    return Promise.reject('not implemented.');
  }

  GetSession(session_id: string): Promise<Session> {
    return Promise.reject('not implemented.');
  }
}

export default ChalkClient;
