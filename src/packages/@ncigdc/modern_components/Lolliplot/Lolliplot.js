import React from 'react';
import * as d3 from 'd3';
import {
  compose,
  branch,
  renderComponent,
  withProps,
  withState,
} from 'recompose';
import { isEqual, groupBy, pickBy, pick } from 'lodash';
import { Lolliplot, Backbone, Minimap } from '@oncojs/react-lolliplot/dist/lib';
import LolliplotStats from './LolliplotStats';
import { withTooltip } from '@ncigdc/uikit/Tooltip';
import { Row } from '@ncigdc/uikit/Flex';
import groupByType from '@ncigdc/utils/groupByType';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
import withSize from '@ncigdc/utils/withSize';
import mapData from './mapData';
import styled from '@ncigdc/theme/styled';
import separateOverlapping from './separateOverlapping';

const id = 'protein-viewer-root';
const STATS_WIDTH = 250;
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

const collisionDataBoxStyle = {
  border: 'solid 1px rgb(186,186,186)',
  marginBottom: '4px',
  marginLeft: '20px',
  fontSize: '10px',
  padding: '20px',
};
const DatumBox = styled.div({
  padding: '10px 0px 10px 0px',
  ':hover': {
    cursor: 'pointer',
  },
});
const LinkSpan = styled.span({
  textDecoration: 'underline',
  color: ({ theme }) => theme.primary,
  cursor: 'pointer',
});

export default compose(
  withTooltip,
  withSize(),
  withProps(({ size: { width } }) => ({
    graphWidth: width && width - STATS_WIDTH,
  })),
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
    (props, nextProps) =>
      !isEqual(
        pick(props, ['activeTranscript', 'ssms', 'state']),
        pick(nextProps, ['activeTranscript', 'ssms', 'state']),
      ),
    ({ activeTranscript, blacklist, ssms, setState, state }) => {
      const lolliplotData = mapData({
        transcript: activeTranscript,
        data: (ssms.hits || []).map(x => ({ score: x._score, ...x._source })),
      });
      const lolliplotCollisions = pickBy(
        groupBy(
          lolliplotData.mutations.filter(
            d => !state[`${blacklist}Blacklist`].has(d[blacklist]),
          ),
          d => `${d.x},${d.y}`,
        ),
        d => d.length > 1,
      );

      // pass data up to parent for download button
      setState(s => ({ ...s, lolliplotData }));
      const impactUnknown = isEqual(
        Object.keys(groupByType('impact', lolliplotData.mutations)),
        ['UNKNOWN'],
      );

      if (blacklist === 'impact' && impactUnknown) {
        setState(s => ({ ...s, blacklist: 'consequence' }));
      }

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
        lolliplotData,
        proteinTracks: separateOverlapping(lolliplotData.proteins),
        outsideSsms: lolliplotData.mutations.filter(
          d => d.x > activeTranscript.length_amino_acid,
        ),
        impactUnknown,
        lolliplotCollisions,
      };
    },
  ),
  withState('expandDomains', 'toggleExpandedDomains', false),
  withState('showCollisionsDataBox', 'setShowCollisionsDataBox', false),
  withState('collidedDataList', 'populateCollisionsDataList', []),
)(
  ({
    activeTranscript,
    graphWidth,
    setState,
    mutationId,
    min,
    max,
    mutationColors,
    blacklist,
    lolliplotData,
    proteinTracks,
    push,
    outsideSsms,
    impactUnknown,
    state,
    clearBlacklist,
    fillBlacklist,
    toggleBlacklistItem,
    filterByType,
    setTooltip,
    expandDomains,
    toggleExpandedDomains,
    lolliplotCollisions,
    showCollisionsDataBox,
    setShowCollisionsDataBox,
    collidedDataList,
    populateCollisionsDataList,
  }) => (
    <Row>
      <div id={id} style={{ flex: 1, userSelect: 'none' }}>
        {graphWidth && (
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
              width={graphWidth}
              update={payload => setState(s => ({ ...s, ...payload }))}
              highlightedPointId={mutationId}
              getPointColor={d => mutationColors[blacklist][d[blacklist]]}
              data={lolliplotData.mutations
                .filter(d => d.x > min && d.x < max)
                .filter(filterByType(blacklist))}
              lolliplotCollisions={lolliplotCollisions}
              onPointClick={d => {
                if (lolliplotCollisions[`${d.x},${d.y}`]) {
                  setShowCollisionsDataBox(true);
                  populateCollisionsDataList(
                    lolliplotCollisions[`${d.x},${d.y}`],
                  );
                } else {
                  setShowCollisionsDataBox(false);
                  push(`/ssms/${d.id}`);
                }
              }}
              onPointMouseover={({ y: cases = 0, ...d }) => {
                lolliplotCollisions[`${d.x},${cases}`]
                  ? setTooltip(
                      'Click to display more mutations at this coordinate',
                    )
                  : setTooltip(
                      <span>
                        <div>
                          <b>DNA Change: {d.genomic_dna_change}</b>
                        </div>
                        <div>ID: {d.id}</div>
                        <div>AA Change: {d.aa_change}</div>
                        <div># of Cases: {cases.toLocaleString()}</div>
                        <div>VEP Impact: {d.impact}</div>
                        {d.sift_impact && (
                          <div>
                            SIFT Impact: {d.sift_impact}, score: {d.sift_score}
                          </div>
                        )}
                        {d.polyphen_impact && (
                          <div>
                            PolyPhen Impact: {d.polyphen_impact}, score:{' '}
                            {d.polyphen_score}
                          </div>
                        )}
                      </span>,
                    );
              }}
              onPointMouseout={() => setTooltip(null)}
            />
            <div style={{ marginTop: '-20px' }}>
              {proteinTracks.length > 1 && (
                <Row style={{ margin: '15px 0 0 15px' }} spacing="5px">
                  <i
                    className="fa fa-warning"
                    style={{
                      color: 'rgb(215, 175, 33)',
                    }}
                  />
                  <span style={{ fontSize: '0.8em' }}>
                    Some overlapping domains are not shown by default. &nbsp;
                    <LinkSpan
                      onClick={() => toggleExpandedDomains(!expandDomains)}
                    >
                      Click here to show / hide them.
                    </LinkSpan>
                  </span>
                </Row>
              )}
              {proteinTracks
                .slice(0, expandDomains ? Infinity : 1)
                .map((trackData, i) => (
                  <Backbone
                    key={i}
                    min={min}
                    max={max}
                    d3={d3}
                    domainWidth={activeTranscript.length_amino_acid}
                    width={graphWidth}
                    update={payload => setState(s => ({ ...s, ...payload }))}
                    data={trackData}
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
                            <div>
                              <b>{d.id}</b>
                            </div>
                            <div>{d.description}</div>
                            <div>
                              <b>Click to reset zoom</b>
                            </div>
                          </span>,
                        );
                      }
                    }}
                    onProteinMouseover={d => {
                      setTooltip(
                        <span>
                          <div>
                            <b>{d.id}</b>
                          </div>
                          <div>{d.description}</div>
                          {min === d.start &&
                            max === d.end && (
                              <div>
                                <b>Click to reset zoom</b>
                              </div>
                            )}
                          {(min !== d.start || max !== d.end) && (
                              <div>
                                <b>Click to zoom</b>
                              </div>
                            )}
                        </span>,
                      );
                    }}
                    onProteinMouseout={() => setTooltip(null)}
                  />
                ))}
              <Minimap
                min={min}
                max={max}
                d3={d3}
                domainWidth={activeTranscript.length_amino_acid}
                width={graphWidth}
                update={payload => setState(s => ({ ...s, ...payload }))}
                data={{
                  ...lolliplotData,
                  mutations: lolliplotData.mutations.filter(
                    filterByType(blacklist),
                  ),
                }}
              />
            </div>
          </div>
        )}
      </div>
      <div>
        {showCollisionsDataBox && (
          <div style={collisionDataBoxStyle}>
            <h6 style={{ margin: '0px' }}>{`Mutations at ${collidedDataList[0]
              .x},${collidedDataList[0].y}`}</h6>
            {collidedDataList.map((d, i) => {
              return (
                <DatumBox onClick={() => push(`/ssms/${d.id}`)} key={d.id}>
                  <div>
                    <b>DNA Change: {d.genomic_dna_change}</b>
                  </div>
                  <div>ID: {d.id}</div>
                  <div>AA Change: {d.aa_change}</div>
                  <div># of Cases: {d.y.toLocaleString()}</div>
                  <div>Functional Impact: {d.impact}</div>
                </DatumBox>
              );
            })}
          </div>
        )}
        <LolliplotStats
          style={{ width: STATS_WIDTH, flex: 'none' }}
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
      </div>
    </Row>
  ),
);
