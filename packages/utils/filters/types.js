/* @flow */

export type TValueContent = {|
  field: string,
  value: mixed,
|};
export type TValueOp = 'in';
export type TValueFilter = {|
  content: TValueContent,
  op: TValueOp,
|};

export type TGroupContent = Array<?TValueFilter>;
export type TGroupOp = 'and';
export type TGroupFilter = {|
  content: TGroupContent,
  op: TGroupOp,
|};
