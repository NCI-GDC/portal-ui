import React from 'react';
import * as d3 from 'd3';
import {
  compose,
  lifecycle,
  withPropsOnChange,
  branch,
  renderComponent,
} from 'recompose';
import { isEqual } from 'lodash';
import { Lolliplot, Backbone, Minimap } from '@oncojs/react-lolliplot/dist/lib';
import LolliplotStats from './LolliplotStats';
import { withTooltip } from '@ncigdc/uikit/Tooltip';
import { Row } from '@ncigdc/uikit/Flex';
import groupByType from '@ncigdc/utils/groupByType';
import mapData from './mapData';

let container;
const id = 'protein-viewer-root';

const highContrastPallet = [
  '#007FAA',
  '#E00000',
  '#9B59B6',
  '#696969',
  '#8D6708',
  '#9F6B3F',
  '#40806A',
  '#DC2A2A',
  '#5A781D',
  '#2574A9',
  '#7462E0',
  '#4B6A88',
  '#856514',
  '#D43900',
];

export default compose(
  withTooltip,
  lifecycle({
    componentDidMount(): void {
      this.onResize = () => {
        if (container) {
          this.props.setState(s => ({ ...s, width: container.clientWidth }));
        }
      };
      window.addEventListener('resize', this.onResize);
    },
    componentWillUnmount(): void {
      window.removeEventListener('resize', this.onResize);
    },
  }),
  withPropsOnChange(['analysis'], ({ analysis }) => ({
    ssms: analysis.protein_mutations.data
      ? JSON.parse(analysis.protein_mutations.data)
      : {},
  })),
  branch(
    ({ ssms }) => !ssms.hits.length,
    renderComponent(() => <div>Not enough data.</div>),
  ),
  withPropsOnChange(
    ['viewer', 'ssms', 'state'],
    ({ activeTranscript, blacklist, ssms, setState }) => {
      const lolliplotData = mapData({
        transcript: activeTranscript,
        data: (ssms.hits || []).map(x => ({ score: x._score, ...x._source })),
      });

      const impactUnknown = isEqual(
        Object.keys(groupByType('impact', lolliplotData.mutations)),
        ['UNKNOWN'],
      );

      if (blacklist === 'impact' && impactUnknown) {
        setState(s => ({ ...s, blacklist: 'consequence' }));
      }

      // pass data up to wrapper -> toolbar
      setState(s => ({ ...s, lolliplotData }));

      return {
        lolliplotData,
        outsideSsms: lolliplotData.mutations.filter(
          d => d.x > activeTranscript.length_amino_acid,
        ),
        impactUnknown,
      };
    },
  ),
  withPropsOnChange(['lolliplotData'], ({ lolliplotData }) => {
    const consequences = groupByType('consequence', lolliplotData.mutations);

    const mutationColors = {
      consequence: Object.keys(consequences).reduce(
        (acc, type, i) => ({
          ...acc,
          [type]: highContrastPallet[i % highContrastPallet.length],
        }),
        {},
      ),
      impact: {
        HIGH: 'rgb(221, 60, 60)',
        MODERATE: 'rgb(132, 168, 56)',
        default: 'rgb(135, 145, 150)',
      },
    };

    return {
      mutationColors,
    };
  }),
)(
  ({
    activeTranscript,
    width,
    setState,
    mutationId,
    min,
    max,
    mutationColors,
    blacklist,
    lolliplotData,
    push,
    outsideSsms,
    impactUnknown,
    state,
    clearBlacklist,
    fillBlacklist,
    toggleBlacklistItem,
    filterByType,
    setTooltip,
  }) =>
    <Row>
      <div
        id={id}
        style={{ flex: 1, userSelect: 'none' }}
        ref={n => {
          if (!width) {
            if (!container) container = n;
            setState(s => ({
              ...s,
              width: s.width || n.clientWidth,
            }));
          }
        }}
      >
        {width &&
          <div style={{ position: 'relative' }}>
            <span
              style={{
                transform: 'rotate(270deg)',
                display: 'inline-block',
                position: 'relative',
                left: -20,
                bottom: -100,
              }}
            >
              # Cases
            </span>
            <Lolliplot
              d3={d3}
              min={min}
              max={max}
              domainWidth={activeTranscript.length_amino_acid}
              width={width}
              update={payload => setState(s => ({ ...s, ...payload }))}
              highlightedPointId={mutationId}
              getPointColor={d => mutationColors[blacklist][d[blacklist]]}
              data={lolliplotData.mutations
                .filter(d => d.x > min && d.x < max)
                .filter(filterByType(blacklist))}
              onPointClick={d => {
                push(`/ssms/${d.id}`);
              }}
              onPointMouseover={({ y: cases = 0, ...d }) => {
                setTooltip(
                  <span>
                    <div><b>DNA Change: {d.genomic_dna_change}</b></div>
                    <div>ID: {d.id}</div>
                    <div>AA Change: {d.aa_change}</div>
                    <div># of Cases: {cases.toLocaleString()}</div>
                    <div>Functional Impact: {d.impact}</div>
                  </span>,
                );
              }}
              onPointMouseout={() => setTooltip(null)}
            />
            <div style={{ marginTop: '-20px' }}>
              <Backbone
                min={min}
                max={max}
                d3={d3}
                domainWidth={activeTranscript.length_amino_acid}
                width={width}
                update={payload => setState(s => ({ ...s, ...payload }))}
                data={lolliplotData.proteins}
                onProteinClick={d => {
                  if (min === d.start && max === d.end) {
                    setState(s => ({
                      ...s,
                      min: 0,
                      max: activeTranscript.length_amino_acid,
                    }));
                    setTooltip(null);
                  } else {
                    setState(s => ({ ...s, min: d.start, max: d.end }));
                    setTooltip(
                      <span>
                        <div><b>{d.id}</b></div>
                        <div>{d.description}</div>
                        <div><b>Click to reset zoom</b></div>
                      </span>,
                    );
                  }
                }}
                onProteinMouseover={d => {
                  setTooltip(
                    <span>
                      <div><b>{d.id}</b></div>
                      <div>{d.description}</div>
                      {min === d.start &&
                        max === d.end &&
                        <div><b>Click to reset zoom</b></div>}
                      {(min !== d.start || max !== d.end) &&
                        <div><b>Click to zoom</b></div>}
                    </span>,
                  );
                }}
                onProteinMouseout={() => setTooltip(null)}
              />
              <Minimap
                min={min}
                max={max}
                d3={d3}
                domainWidth={activeTranscript.length_amino_acid}
                width={width}
                update={payload => setState(s => ({ ...s, ...payload }))}
                data={{
                  ...lolliplotData,
                  mutations: lolliplotData.mutations.filter(
                    filterByType(blacklist),
                  ),
                }}
              />
            </div>
          </div>}
      </div>
      <LolliplotStats
        mutations={lolliplotData.mutations}
        filterByType={filterByType}
        blacklist={blacklist}
        min={min}
        max={max}
        outsideSsms={outsideSsms}
        setState={setState}
        impactUnknown={impactUnknown}
        clearBlacklist={clearBlacklist}
        fillBlacklist={fillBlacklist}
        toggleBlacklistItem={toggleBlacklistItem}
        mutationColors={mutationColors}
        state={state}
      />
    </Row>,
);
