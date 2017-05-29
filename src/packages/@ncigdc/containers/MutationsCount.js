// @flow
/* eslint fp/no-mutating-methods: 0 */

import React from "react";
import Relay from "react-relay/classic";
import { lifecycle, compose, withProps, withState } from "recompose";
import { isEqual, some } from "lodash";
import GreyBox from "@ncigdc/uikit/GreyBox";
import queue from "queue";
import ExploreLink from "@ncigdc/components/Links/ExploreLink";
import type { TGroupFilter } from "@ncigdc/utils/filters/types";

const requestQueue = queue({
  concurrency: 4,
  autostart: true
});

type TProps = {
  filters: TGroupFilter,
  ssms: {
    hits: {
      total: number
    }
  },
  setRelayFilters: Function
};
const MutationsCountComponent = compose(
  withState("queueItem", "setQueueItem", undefined),
  withProps(({ relay }) => ({
    setRelayFilters: ({ filters }: TProps, setQueueItem) => {
      const variables = { ssmsFilters: filters, fetchData: !!filters };
      const queueItem = cb =>
        relay.setVariables(variables, readyState => {
          if (some([readyState.ready, readyState.aborted, readyState.error])) {
            cb();
            setQueueItem(undefined);
          }
        });
      requestQueue.push(queueItem);
      setQueueItem(() => queueItem);
    }
  })),
  lifecycle({
    componentDidMount(): void {
      this.safeSetQueueItem = item => {
        // eslint-disable-line fp/no-mutation
        if (item || this.props.queueItem) {
          this.props.setQueueItem(undefined);
        }
      };

      this.props.setRelayFilters(this.props, this.safeSetQueueItem);
    },
    componentWillReceiveProps(nextProps: TProps): void {
      if (!isEqual(this.props.filters, nextProps.filters)) {
        nextProps.setRelayFilters(nextProps, this.safeSetQueueItem);
      }
    },
    componentWillUnmount(): void {
      // Remove request from queue since it's no longer needed
      const queueItem = this.props.queueItem;
      if (queueItem && requestQueue.indexOf(queueItem) !== -1) {
        requestQueue.splice(requestQueue.indexOf(queueItem), 1);
      }
      this.props.setQueueItem(undefined);
    }
  })
)(
  ({ ssms, filters }: TProps = {}) =>
    ssms.hits
      ? <ExploreLink
          merge
          query={{
            searchTableTab: "mutations",
            filters
          }}
        >
          {ssms.hits.total.toLocaleString()}
        </ExploreLink>
      : <GreyBox />
);

export const MutationsCountQuery = {
  initialVariables: {
    ssmsFilters: null,
    fetchData: false
  },
  fragments: {
    ssms: () => Relay.QL`
      fragment on Ssms {
        blah: hits(first: 0) { total }
        hits(filters: $ssmsFilters) @include(if: $fetchData) {
          total
        }
      }
    `
  }
};

const MutationsCount = Relay.createContainer(
  MutationsCountComponent,
  MutationsCountQuery
);

export default MutationsCount;
