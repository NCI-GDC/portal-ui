/* @flow */

import type { TUriQuery, TRemoveEmptyKeys } from '@ncigdc/utils/uri/types';
import type { TMergeQuery, TMergeEnum } from '@ncigdc/utils/filters/types';

export type TListLinkProps = {
  children?: mixed,
  merge?: TMergeEnum,
  mergeQuery?: TMergeQuery,
  pathname?: string,
  query?: TUriQuery,
  removeEmptyKeys?: TRemoveEmptyKeys,
  whitelist?: Array<string>,
};

export type TIdLinkProps = {
  uuid: string,
} & TListLinkProps;

export type TLinkProps = TListLinkProps | TIdLinkProps;
