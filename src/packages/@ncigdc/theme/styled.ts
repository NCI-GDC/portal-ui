import domElements from './utils/domElements';
import validAttributes from './utils/validAttributes';
import { css, CSSProperties } from 'glamor';
import { withTheme } from './index';
import { ComponentType, createElement } from 'react';

type TAddPropsToFunction = (
  value: (props: object) => string | string,
  props: object
) => string;
const addPropsToFunction: TAddPropsToFunction = (value, props) =>
  typeof value === 'function' ? value(props) : value;

type TMapValues = (style: CSSProperties, props: object) => object;
const mapValues: TMapValues = (style, props) =>
  Object.entries(style).reduce(
    (acc, [k, v]) => ({
      ...acc,
      [k]:
        typeof v === 'object'
          ? mapValues(v, props)
          : addPropsToFunction(v, props),
    }),
    {}
  );

type TCreateStyledComponent = (
  el: string | ComponentType<any>
) => (style: CSSProperties) => ComponentType<any>;

const createStyledComponent: TCreateStyledComponent = el => style =>
  withTheme(({ ref, children, theme, ...props }) => {
    const validAttrProps =
      typeof el === 'string' ? validAttributes(props) : props;

    const className = `${props.className || ''} ${css(
      mapValues(style, {
        theme,
        ...props,
      })
    )}`;

    const elem = createElement(
      el,
      {
        ...validAttrProps,
        className,
        ...ref ? { ref: node => ref(node) } : {},
      },
      children
    );

    debugger;

    return elem;
  });

type TStyled = (el: ComponentType, style: CSSProperties) => ComponentType;

const styled: TStyled = (el, style) => createStyledComponent(el)(style);
domElements.forEach(el => {
  styled[el] = createStyledComponent(el);
});

export default styled;
