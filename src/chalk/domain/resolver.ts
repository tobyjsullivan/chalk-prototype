export type Result = NoneType | Number | String | List | Record;

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
