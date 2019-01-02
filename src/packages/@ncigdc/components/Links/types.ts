import { ReactNode } from 'react';
import { TMergeEnum, TMergeQuery } from '@ncigdc/utils/filters/types';
import { TRemoveEmptyKeys } from '@ncigdc/utils/removeEmptyKeys';
import { IUriQuery } from '@ncigdc/utils/uri/types';

export interface IListLinkProps {
  children?: ReactNode;
  merge?: TMergeEnum;
  mergeQuery?: TMergeQuery;
  pathname?: string;
  query?: IUriQuery;
  removeEmptyKeys?: TRemoveEmptyKeys;
  whitelist?: string[];
}

export interface IIdLinkProps {
  uuid?: string;
  style?: object;
}

export type TLinkProps = IListLinkProps & IIdLinkProps;
