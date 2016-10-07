/* @flow */

import type { TUriQuery } from '@ncigdc/utils/uri/types';

export type TListLinkProps = {
  children?: mixed,
  merge?: boolean,
  pathname?: string,
  query?: TUriQuery,
};

export type TIdLinkProps = {
  id: string,
} & TListLinkProps;

export type TLinkProps = TListLinkProps | TIdLinkProps;
