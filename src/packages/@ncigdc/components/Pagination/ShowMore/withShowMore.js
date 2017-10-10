// @flow
import { compose, withState, lifecycle } from 'recompose';
import { get, isEqual } from 'lodash';

type TProps = {
  itemExtractor: Function,
  pathToData: string,
  offsetPrefix: string,
};

const withShowMore = ({ itemExtractor, pathToData, offsetPrefix }: TProps) => {
  return compose(
    withState('loadedItems', 'setLoadedItems', []),
    withState('shouldLoad', 'setShouldLoad', false),
    lifecycle({
      componentDidMount(): void {
        const items = itemExtractor(get(this.props, pathToData));
        this.props.setLoadedItems(items);
      },
      componentWillReceiveProps(nextProps): void {
        if (
          this.props.shouldLoad &&
          !isEqual(get(nextProps, pathToData), get(this.props, pathToData))
        ) {
          const items = itemExtractor(get(nextProps, pathToData));
          this.props.setLoadedItems([...this.props.loadedItems, ...items]);
          this.props.setShouldLoad(false);
        } else if (
          !isEqual(
            nextProps.variables[`${offsetPrefix}_offset`],
            this.props.variables[`${offsetPrefix}_offset`],
          ) &&
          isEqual(nextProps.variables.filters, this.props.variables.filters)
        ) {
          this.props.setShouldLoad(true);
        } else if (
          !isEqual(this.props.query.filters, nextProps.query.filters)
        ) {
          this.props.setShouldLoad(true);
          this.props.setLoadedItems([]);
        }
      },
    }),
  );
};

export default withShowMore;
