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
};

export type TIdLinkProps = {
  id: string,
} & TListLinkProps;

export type TLinkProps = TListLinkProps | TIdLinkProps;
