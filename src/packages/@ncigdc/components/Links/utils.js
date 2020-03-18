/* @flow */

import React from 'react';
import CaretIconDown from 'react-icons/lib/fa/caret-down';

import HeaderDropdown from '@ncigdc/components/Header/Dropdown';
import { DISPLAY_DAVE_CA } from '@ncigdc/utils/constants';
import Link from './Link';

import { IListLinkProps, IIdLinkProps, TLinkProps } from './types';

type TIdLinkConfig = {
  pathname: string,
};

type TListLinkConfig = {
  children: string,
  pathname: string,
  query?: Object,
};

type TMakeLinkBase = (p: TLinkProps) => React.Element<>;
const makeLinkBase: TMakeLinkBase = ({
  dropDownElements = [],
  isDropDown = false,
  ...props
}) => (DISPLAY_DAVE_CA && dropDownElements.length > 0 && isDropDown
  ? (
    <HeaderDropdown
      items={dropDownElements}
      {...props}
      >
      <button
        className="header-link"
        data-test={props.testTag}
        type="button"
        >
        {props.children}
        <CaretIconDown />
      </button>
    </HeaderDropdown>
  )
  : <Link {...props} />
);

type TMakeIdLink = (c: TIdLinkConfig) => (p: IIdLinkProps) => React.Element<>;
export const makeIDLink: TMakeIdLink = config => props => {
  const pathname = `${config.pathname}/${props.uuid}`;
  const children = props.children || props.uuid;

  return makeLinkBase({
    ...props,
    children,
    pathname,
  });
};

export type TMakeListLink = (
  c: TListLinkConfig
) => (p: IListLinkProps) => React.Element<>;
export const makeListLink: TMakeListLink = ({
  query: configQuery,
  ...config
}) => ({ query, ...props }) => makeLinkBase({
  query: {
    ...configQuery,
    ...query,
  },
  ...config,
  ...props,
});
