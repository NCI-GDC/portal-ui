// @flow

import { createElement } from 'react';
import { css } from 'glamor';
import { withTheme } from './index';
import validAttributes from './utils/validAttributes';
import domElements from './utils/domElements';

type TAddPropsToFunction = (value: Function | string, props: Object) => string;
const addPropsToFunction: TAddPropsToFunction = (value, props) =>
  typeof value === 'function' ? value(props) : value;

type TMapValues = (style: Object, props: Object) => Object;
const mapValues: TMapValues = (style, props) =>
  Object.entries(style).reduce(
    (acc, [k, v]) => ({
      ...acc,
      [k]:
        typeof v === 'object'
          ? mapValues(v, props)
          : addPropsToFunction(v, props),
    }),
    {},
  );

type TCreateStyledComponent = (
  el: string | ReactClass<{}>,
) => (style: Object) => ReactClass<*>;
const createStyledComponent: TCreateStyledComponent = el => style =>
  withTheme(({ ref, children, theme, ...props }) => {
    const validAttrProps =
      typeof el === 'string' ? validAttributes(props) : props;

    return createElement(
      el,
      {
        ...validAttrProps,
        ref: node => (ref ? ref(node) : () => {}),
        className: `${props.className || ''} ${css(
          mapValues(style, {
            theme,
            ...props,
          }),
        )}`,
      },
      children,
    );
  });

type TStyled = (el: ReactClass<{}>, style: Object) => ReactClass<{}>;
const styled: TStyled = (el, style) => createStyledComponent(el)(style);
domElements.forEach(el => {
  styled[el] = createStyledComponent(el);
});

export default styled;
