import {Result} from './resolver';

export interface Session {
  id: string,
};

export interface VariableState {
  id: string,
  name: string,
  formula: string,
  result: Result,
}
