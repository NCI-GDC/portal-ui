import { css, CSSProperties } from 'glamor';
import { ComponentType, createElement, ReactHTML } from 'react';
import domElements from './utils/domElements';
import validAttributes from './utils/validAttributes';
import { withTheme } from './index';

type TAddPropsToFunction = (
  value: (props: object) => string | string,
  props: object
) => string;
const addPropsToFunction: TAddPropsToFunction = (value, props) => (typeof value === 'function' ? value(props) : value);

type TMapValues = (style: CSSProperties, props: object) => object;
const mapValues: TMapValues = (style, props) => Object.entries(style).reduce(
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

const createStyledComponent: TCreateStyledComponent = el => style => withTheme(({
  ref, children, theme, ...props
}) => {
  const validAttrProps =
      typeof el === 'string' ? validAttributes(props) : props;

  return createElement(
    el,
    {
      ...validAttrProps,
      className: `${props.className || ''} ${css(
        mapValues(style, {
          theme,
          ...props,
        })
      )}`,
      ...ref ? { ref: node => ref(node) } : {},
    },
    children
  );
});

type TStyled = (
  el: string | ComponentType,
  style: CSSProperties
) => ComponentType<any> | keyof ReactHTML;
const styled: TStyled = (el, style) => createStyledComponent(el)(style);
domElements.forEach(el => {
  styled[el] = createStyledComponent(el);
});

export default styled;
