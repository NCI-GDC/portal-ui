// @flow
import React from 'react';
import { sortable } from '@ncigdc/uikit/Sortable';

type TProps = { children: mixed };
const SortableItem = (props: TProps) => <div {...props}>{props.children}</div>;
export default sortable(SortableItem);
