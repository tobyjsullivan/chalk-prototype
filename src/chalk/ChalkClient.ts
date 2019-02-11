import axios from 'axios';

import {setVariable} from './variables';
import {executeFormula} from './resolver';
import {Result} from './domain/resolver';
import {Session} from './domain';

class ChalkClient {
  apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  createSession(): Promise<Session> {
    return Promise.reject('not implemented.');
  }

  getSession(session_id: string): Promise<Session> {
    return Promise.reject('not implemented.');
  }

  setVariable(varName: string, formula: string): Promise<{}> {
    console.log('Setting variable', varName, formula);
    return setVariable(this.apiUrl, varName, formula);
  }

  execute(formula: string): Promise<Result> {
    console.log('Firing execute:', formula);
    return executeFormula(this.apiUrl, formula);
  }

  checkConnection(): Promise<{}> {
    return axios.get(this.apiUrl + '/health');
  }
}

export default ChalkClient;
