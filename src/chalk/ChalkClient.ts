import axios from 'axios';

import {ExecuteFormula} from './resolver';
import {Result} from './domain/resolver';
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

  Execute(formula: string): Promise<Result> {
    return ExecuteFormula(this.apiUrl, formula);
  }
}

export default ChalkClient;
