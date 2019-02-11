import axios from 'axios';

import {Result, None} from '../domain/resolver';

export function executeFormula(apiUrl: string, formula: string): Promise<Result> {
  return axios.post(apiUrl+'/execute', {
    formula,
  }).then((resp) => {
    const payload: ApiResult = resp.data;

    if (payload.error) {
      throw payload.error;
    }

    if (!payload.result) {
      // Empty result
      return None;
    }
    return parseApiResultObject(payload.result);
  });
}

function parseApiResultObject(obj: ApiResultObject): Result {
  switch (obj.type.class) {
  case 'number':
    if (!obj.numberValue) {
      throw 'missing numberValue';
    }
    return {
      resultType: 'number',
      value: obj.numberValue,
    };
  case 'string':
    if (!obj.stringValue) {
      throw 'missing stringValue';
    }
    return {
      resultType: 'string',
      value: obj.stringValue,
    };
  case 'list':
    if (!obj.listValue) {
      throw 'missing listValue';
    }
    return {
      resultType: 'list',
      elements: obj.listValue.elements.map(parseApiResultObject),
    }
  case 'record':
    if (!obj.recordValue) {
      throw 'missing recordValue';
    }

    const properties = [];
    for (const [key, value] of Object.entries(obj.recordValue.properties)) {
      properties.push({
        name: key,
        value: parseApiResultObject(value),
      })
    }

    return {
      resultType: 'record',
      properties,
    }
  default:
    throw `unknown type ${obj.type.class}`;
  }
}

interface ApiResult {
  error?: string,
  result?: ApiResultObject,
}

interface ApiResultObject {
  type: {
    class: string,
  },
  numberValue?: number,
  stringValue?: string,
  listValue?: {
    elements: ReadonlyArray<ApiResultObject>,
  },
  recordValue?: {
    properties: ReadonlyMap<string, ApiResultObject>,
  },
}
