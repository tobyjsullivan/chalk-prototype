import axios from 'axios';

import {createSession, getSession} from './sessions';
import {createVariable, renameVariable, updateVariable, getVariables} from './variables';
import {executeFormula} from './resolver';
import {Result} from './domain/resolver';
import {Session, VariableState} from './domain';

class ChalkClient {
  apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  createSession(): Promise<Session> {
    return createSession(this.apiUrl);
  }

  getSession(sessionId: string): Promise<Session | null> {
    return getSession(this.apiUrl, sessionId);
  }

  createVariable(varName: string, formula: string): Promise<VariableState> {
    return createVariable(this.apiUrl, varName, formula);
  }

  renameVariable(id: string, varName: string): Promise<VariableState> {
    return renameVariable(this.apiUrl, id, varName);
  }

  updateVariable(id: string, formula: string): Promise<VariableState> {
    return updateVariable(this.apiUrl, id, formula);
  }

  getVariables(ids: ReadonlyArray<string>): Promise<ReadonlyArray<VariableState>> {
    return getVariables(this.apiUrl, ids);
  }

  checkConnection(): Promise<{}> {
    return axios.get(this.apiUrl + '/health');
  }
}

export default ChalkClient;
