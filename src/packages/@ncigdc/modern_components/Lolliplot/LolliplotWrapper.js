// @flow

import React from 'react';
import {
  compose,
  withProps,
  withPropsOnChange,
  withState,
  lifecycle,
} from 'recompose';
import { insertRule } from 'glamor';
import withRouter from '@ncigdc/utils/withRouter';
import { Row, Column } from '@ncigdc/uikit/Flex';
import DoubleHelix from '@ncigdc/theme/icons/DoubleHelix';
import LolliplotComponent from './Lolliplot';
import createLolliplotRenderer from './Lolliplot.relay';
import LolliplotToolbar from './LolliplotToolbar';

const Lolliplot = createLolliplotRenderer(LolliplotComponent);

const id = 'protein-viewer-root';
const selector = `#${id}`;

insertRule(`
  [class^="mutation-circle"] { cursor: pointer; }
`);

const styles = {
  heading: {
    flexGrow: 1,
    fontSize: '2.2rem',
    marginBottom: 7,
    marginTop: 7,
    display: 'flex',
    alignItems: 'center',
  },
};

export default compose(
  withRouter,
  withPropsOnChange(
    ['viewer'],
    ({
      viewer: {
        explore: { genes: { hits: { edges } }, ssms: { aggregations } },
      },
    }) => ({
      gene: edges[0].node,
      transcriptBuckets:
        aggregations.consequence__transcript__transcript_id.buckets,
    }),
  ),
  withState('state', 'setState', props => {
    const activeTranscript = (props.gene.transcripts.hits.edges.find(
      x => x.node.is_canonical,
    ) || {}
    ).node;

    return {
      lolliplotData: null,
      activeTranscript,
      min: 0,
      max: activeTranscript.length_amino_acid,
      width: 0,
      blacklist: 'consequence',
      consequenceBlacklist: new Set(),
      impactBlacklist: new Set(),
    };
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (this.props.gene.gene_id !== nextProps.gene.gene_id) {
        const activeTranscript = (nextProps.gene.transcripts.hits.edges.find(
          x => x.node.is_canonical,
        ) || {}
        ).node;

        this.props.setState(s => ({
          ...s,
          activeTranscript,
          min: 0,
          max: activeTranscript.length_amino_acid,
          width: 0,
          blacklist: 'consequence',
          consequenceBlacklist: new Set(),
          impactBlacklist: new Set(),
        }));
      }
    },
  }),
  withProps(({ state, setState }) => ({
    toggleBlacklistItem: variant => {
      const blacklist = new Set(state[`${state.blacklist}Blacklist`]);
      if (blacklist.has(variant)) {
        blacklist.delete(variant);
      } else {
        blacklist.add(variant);
      }
      setState(s => ({ ...s, [`${state.blacklist}Blacklist`]: blacklist }));
    },
    clearBlacklist: () => {
      setState(s => ({ ...s, [`${state.blacklist}Blacklist`]: new Set() }));
    },
    fillBlacklist: variants => {
      const blacklist = new Set(variants);
      setState(s => ({ ...s, [`${state.blacklist}Blacklist`]: blacklist }));
    },
  })),
  withPropsOnChange(['state'], ({ state }) => ({
    filterByType: type => d => !state[`${type}Blacklist`].has(d[type]),
  })),
  withPropsOnChange(['viewer'], ({ gene }, transcripts) => ({
    transcripts: transcripts
      ? transcripts
      : gene ? gene.transcripts.hits.edges.map(x => x.node) : transcripts,
  })),
)(
  ({
    state: {
      activeTranscript,
      notEnoughData = false,
      width,
      min,
      max,
      blacklist,
      lolliplotData,
      ...state
    },
    mutationId,
    toggleBlacklistItem,
    clearBlacklist,
    fillBlacklist,
    setState,
    gene,
    push,
    filterByType,
    transcripts,
    transcriptBuckets,
  }) => (
    <Column style={{ backgroundColor: 'white' }}>
      <Row>
        <h1 style={{ ...styles.heading, padding: '1rem' }} id="protein">
          <DoubleHelix width={12} />
          <span style={{ marginLeft: '1rem' }}>{gene.symbol} - Protein</span>
        </h1>
      </Row>
      <div>
        {lolliplotData && (
          <LolliplotToolbar
            activeTranscript={activeTranscript}
            gene={gene}
            transcripts={transcripts.filter(x =>
              transcriptBuckets.find(b => b.key === x.transcript_id),
            )}
            setState={setState}
            selector={selector}
            lolliplotData={lolliplotData}
          />
        )}
        {notEnoughData && (
          <Column style={{ alignItems: 'center', padding: '20px' }}>
            Not enough data
          </Column>
        )}
        <div style={{ padding: '0 3rem 2rem' }}>
          <Lolliplot
            activeTranscript={activeTranscript}
            width={width}
            setState={setState}
            mutationId={mutationId}
            min={min}
            max={max}
            blacklist={blacklist}
            push={push}
            state={state}
            clearBlacklist={clearBlacklist}
            fillBlacklist={fillBlacklist}
            toggleBlacklistItem={toggleBlacklistItem}
            filterByType={filterByType}
          />
        </div>
      </div>
    </Column>
  ),
);
