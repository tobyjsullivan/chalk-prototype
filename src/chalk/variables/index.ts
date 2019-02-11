import axios from 'axios';

export function setVariable(apiUrl: string, varName: string, formula: string): Promise<{}> {
  return axios.post(apiUrl+'/variables', {
    varName,
    formula,
  });
}
