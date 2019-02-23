export type Result = NoneType | Number | String | Lambda | List | Record | Error;

export const None: NoneType = {
  resultType: 'none',
}

interface NoneType {
  resultType: 'none',
}

export interface Number {
  resultType: 'number',
  value: number,
}

export interface String {
  resultType: 'string',
  value: string,
}

export interface Lambda {
  resultType: 'lambda',
  freeVariables: [string],
}

export interface List {
  resultType: 'list',
  elements: ReadonlyArray<Result>,
}

export interface Record {
  resultType: 'record',
  properties: ReadonlyArray<RecordProperty>;
}

export interface RecordProperty {
  name: string;
  value: Result;
}

interface Error {
  resultType: 'error',
  message: string,
}
