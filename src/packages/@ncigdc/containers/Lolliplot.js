// @flow

import React from 'react';
import Relay from 'react-relay/classic';
import moment from 'moment';
import {
  compose,
  lifecycle,
  withProps,
  withPropsOnChange,
  withState,
} from 'recompose';
import { insertRule } from 'glamor';
import * as d3 from 'd3';
import { startCase, isEqual } from 'lodash';
import { Lolliplot, Backbone, Minimap } from '@oncojs/react-lolliplot/dist/lib';
import Tooltip from '@ncigdc/uikit/Tooltip/Tooltip';
import significantConsequences from '@ncigdc/utils/filters/prepared/significantConsequences';
import withRouter from '@ncigdc/utils/withRouter';
import groupByType from '@ncigdc/utils/groupByType';
import { buildProteinLolliplotData } from '@ncigdc/utils/data';
import { withTooltip } from '@ncigdc/uikit/Tooltip';
import { Row, Column } from '@ncigdc/uikit/Flex';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Dropdown from '@ncigdc/uikit/Dropdown';
import Spinner from '@ncigdc/uikit/Loaders/Material';
import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
import DoubleHelix from '@ncigdc/theme/icons/DoubleHelix';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import Loader from '@ncigdc/uikit/Loaders/Loader';
import wrapSvg from '@ncigdc/utils/wrapSvg';
import { performanceTracker } from '@ncigdc/utils/analytics';

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

type TTranscript = {
  length_amino_acid: number,
  is_canonical: boolean,
  transcript_id: string,
};

type TProps = {
  ssms: {
    hits: {
      edges: Array<{
        node: {},
      }>,
    },
  },
  state: {
    activeTranscript: TTranscript,
    actions: {
      reset: Function,
    },
  },
  viewer: {
    node: {
      transcripts: {
        hits: {
          edges: Array<{
            node: TTranscript,
          }>,
        },
      },
    },
  },
  setState: Function,
  setTooltip: Function,
  push: Function,
  geneId: String,
  relay: Object,
  mutationId: string,
};

let container;

let count = 0;

const LolliplotComponent = compose(
  withTooltip,
  withRouter,
  withState('state', 'setState', {
    activeTranscript: {},
    min: 0,
    max: 500,
    width: 0,
    blacklist: 'consequence',
    consequenceBlacklist: new Set(),
    impactBlacklist: new Set(),
    ssmsLoading: false,
  }),
  withProps(({ state, setState }) => ({
    fetchGene(props: Object): void {
      performanceTracker.begin('lolliplot:fetch:gene');
      props.relay.setVariables(
        {
          fetchGene: true,
          lolliplotGeneId: btoa(`Gene:${props.geneId}`),
        },
        ({ done }) =>
          done &&
          performanceTracker.end('lolliplot:fetch:gene', {
            gene_id: props.geneId,
          }),
      );
    },
    fetchSsms(props: Object): void {
      performanceTracker.begin('lolliplot:fetch:ssms');
      const transcript = props.state.activeTranscript.transcript_id
        ? props.state.activeTranscript
        : (props.viewer.node.transcripts.hits.edges.find(
            x => x.node.is_canonical,
          ) || {}).node;

      props.relay.setVariables(
        {
          fetchSsms: true,
          lolliplotFilters: {
            op: 'and',
            content: [
              significantConsequences,
              {
                op: '=',
                content: {
                  field: 'consequence.transcript.transcript_id',
                  value: transcript.transcript_id,
                },
              },
            ],
          },
        },
        ({ done }) => {
          if (!props.state.ssmsLoading && !done) {
            props.setState(s => ({ ...s, ssmsLoading: true }));
          }

          if (done) {
            props.setState(s => ({ ...s, ssmsLoading: false }));
            performanceTracker.end('lolliplot:fetch:ssms', {
              gene_id: props.geneId,
              transcript_id: transcript.transcript_id,
            });
          }
        },
      );
    },
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
  withPropsOnChange(['lolliplot'], ({ lolliplot }) => ({
    ssms: lolliplot.data ? JSON.parse(lolliplot.data) : {},
  })),
  lifecycle({
    componentDidMount(): void {
      this.props.fetchGene(this.props);

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
    async componentWillReceiveProps(nextProps: TProps): Promise<*> {
      /*
        scenario a)

        first time around nothing has been fetched

        scenario b)

        component receives new data (ex. quicksearch transition, transcript selection)
        both gene and ssm may have been loaded into relay props already

        ~~~

        in both cases, gene will be fetched before ssms

      */

      // if page id changes:
      //
      if (this.props.geneId !== nextProps.geneId) {
        this.props.fetchGene(nextProps);
        return;
      }

      // no gene yet

      if (!nextProps.viewer.node) {
        return;
      }

      // gene returned, display plot

      if (!this.props.viewer.node && nextProps.viewer.node) {
        const activeTranscript = (nextProps.viewer.node.transcripts.hits.edges.find(
          x => x.node.is_canonical,
        ) || {}).node;

        this.props.setState(s => ({
          ...s,
          activeTranscript,
          min: 0,
          max: activeTranscript.length_amino_acid,
        }));

        return;
      }

      // if the gene changed

      if (this.props.viewer.node) {
        const pt = (this.props.viewer.node.transcripts.hits.edges.find(
          x => x.node.is_canonical,
        ) || {}).node;
        const nt = (nextProps.viewer.node.transcripts.hits.edges.find(
          x => x.node.is_canonical,
        ) || {}).node;

        if (pt.transcript_id !== nt.transcript_id) {
          const activeTranscript = (nextProps.viewer.node.transcripts.hits.edges.find(
            x => x.node.is_canonical,
          ) || {}).node;

          this.props.setState(s => ({
            ...s,
            activeTranscript,
            min: 0,
            max: activeTranscript.length_amino_acid,
          }));

          return;
        }
      }

      // if we have not received ssm data yet, fetchSsms will receive hits.total

      if (!nextProps.ssms.hits && count < 1) {
        this.props.fetchSsms(nextProps);
        count++;
        return;
      }

      // if we have ssms but the transcript changed

      if (
        this.props.state.activeTranscript.transcript_id !==
        nextProps.state.activeTranscript.transcript_id
      ) {
        this.props.fetchSsms(nextProps);
      }
    },
  }),
  withPropsOnChange(['state'], ({ state }) => ({
    filterByType: type => d => !state[`${type}Blacklist`].has(d[type]),
  })),
  withPropsOnChange(
    ['viewer', 'ssms', 'state'],
    ({ state: { activeTranscript, blacklist }, ssms, setState }) => {
      const lolliplotData = buildProteinLolliplotData({
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
  withPropsOnChange(['viewer'], ({ viewer: { node: gene } }, transcripts) => ({
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
      ssmsLoading,
      ...state
    },
    mutationId,
    toggleBlacklistItem,
    clearBlacklist,
    fillBlacklist,
    setState,
    viewer: { node: gene },
    ssms,
    setTooltip,
    push,
    lolliplotData,
    mutationColors,
    filterByType,
    transcripts,
    outsideSsms,
    impactUnknown,
  }) =>
    <Column>
      <Row>
        <h1 style={{ ...styles.heading, padding: '1rem' }} id="protein">
          <DoubleHelix width={12} />
          <span style={{ marginLeft: '1rem' }}>
            {(gene || {}).symbol} - Protein
          </span>
        </h1>
      </Row>
      <Loader loading={!gene || !lolliplotData.mutations.length} height="503px">
        {gene &&
          <Row
            style={{
              marginBottom: '2rem',
              padding: '0 2rem',
              alignItems: 'center',
              height: '35px',
            }}
            spacing="1rem"
          >
            <span style={{ alignSelf: 'center' }}>
              Transcript:
            </span>
            <Dropdown
              selected={
                <span
                  style={{
                    fontWeight: activeTranscript.transcript_id ===
                      gene.canonical_transcript_id
                      ? 'bold'
                      : 'initial',
                  }}
                >
                  {activeTranscript.transcript_id}
                  {' '}
                  (
                  {activeTranscript.length_amino_acid}
                  {' '}
                  aa)
                </span>
              }
            >
              {transcripts
                .filter(t => t.transcript_id === gene.canonical_transcript_id)
                .map(t =>
                  <DropdownItem
                    key={t.transcript_id}
                    style={{
                      fontWeight: 'bold',
                      ...(activeTranscript.transcript_id === t.transcript_id
                        ? {
                            backgroundColor: 'rgb(44, 136, 170)',
                            color: 'white',
                          }
                        : {}),
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      setState(s => ({
                        ...s,
                        activeTranscript: t,
                        min: 0,
                        max: t.length_amino_acid,
                      }))}
                  >
                    {t.transcript_id} ({t.length_amino_acid} aa)
                  </DropdownItem>,
                )}
              {transcripts
                .filter(
                  t =>
                    t.length_amino_acid &&
                    t.transcript_id !== gene.canonical_transcript_id,
                )
                .map(t =>
                  <DropdownItem
                    key={t.transcript_id}
                    style={{
                      ...(activeTranscript.transcript_id === t.transcript_id
                        ? {
                            backgroundColor: 'rgb(44, 136, 170)',
                            color: 'white',
                          }
                        : {}),
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      setState(s => ({
                        ...s,
                        activeTranscript: t,
                        min: 0,
                        max: t.length_amino_acid,
                      }))}
                  >
                    {t.transcript_id} ({t.length_amino_acid} aa)
                  </DropdownItem>,
                )}
            </Dropdown>
            <Button
              style={visualizingButton}
              onClick={() =>
                setState(s => ({
                  ...s,
                  min: 0,
                  max: activeTranscript.length_amino_acid,
                }))}
              leftIcon={<i className="fa fa-refresh" />}
            >
              Reset
            </Button>
            <DownloadVisualizationButton
              svg={() =>
                wrapSvg({
                  selector: `${selector} svg.chart`,
                  title: `Gene: ${gene.symbol}, Transcript: ${activeTranscript.transcript_id}(${activeTranscript.length_amino_acid} aa)`,
                  margins: { top: 20, right: 20, bottom: 20, left: 40 },
                  embed: {
                    right: {
                      width: 250,
                      margins: {
                        right: 20,
                      },
                      elements: [document.querySelector('#mutation-stats')],
                    },
                  },
                })}
              data={lolliplotData}
              stylePrefix="#protein-viewer-root"
              slug={`protein_viewer-${gene.symbol}-${moment().format(
                'YYYY-MM-DD',
              )}`}
            />
            {ssmsLoading &&
              <Row style={{ marginLeft: 'auto', alignItems: 'center' }}>
                <div style={{ transform: 'scale(0.6)' }}>
                  <Spinner />
                </div>
              </Row>}
          </Row>}
        {notEnoughData &&
          <Column style={{ alignItems: 'center', padding: '20px' }}>
            Not enough data
          </Column>}
        <div style={{ padding: '0 3rem 2rem' }}>
          {ssms.hits &&
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
                  <div>
                    <Lolliplot
                      d3={d3}
                      min={min}
                      max={max}
                      domainWidth={activeTranscript.length_amino_acid}
                      width={width}
                      update={payload => setState(s => ({ ...s, ...payload }))}
                      highlightedPointId={mutationId}
                      getPointColor={d =>
                        mutationColors[blacklist][d[blacklist]]}
                      data={lolliplotData.mutations
                        .filter(d => d.x > min && d.x < max)
                        .filter(filterByType(blacklist))}
                      onPointClick={d => {
                        push(`/ssms/${d.id}`);
                      }}
                      onPointMouseover={({ y: cases = 0, ...d }) => {
                        setTooltip(
                          <span>
                            <div><b>{d.id}</b></div>
                            <div>AA Change: {d.aa_change}</div>
                            <div>DNA Change: {d.genomic_dna_change}</div>
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
                        update={payload =>
                          setState(s => ({ ...s, ...payload }))}
                        data={lolliplotData.proteins}
                        onProteinClick={d =>
                          setState(s => ({ ...s, min: d.start, max: d.end }))}
                        onProteinMouseover={d => {
                          setTooltip(
                            <span>
                              <div><b>{d.id}</b></div>
                              <div>{d.description}</div>
                              <div><b>Click to zoom</b></div>
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
                        update={payload =>
                          setState(s => ({ ...s, ...payload }))}
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
              <div
                id="mutation-stats"
                style={{ marginLeft: '20px', width: '250px' }}
              >
                <div
                  style={{
                    border: '1px solid rgb(186, 186, 186)',
                    padding: '13px',
                  }}
                >
                  <div>
                    <span>
                      Viewing
                      {' '}
                      {
                        lolliplotData.mutations
                          .filter(d => d.x >= min && d.x <= max)
                          .filter(filterByType(blacklist)).length
                      }
                    </span>
                    <span> / </span>
                    <span>{lolliplotData.mutations.length} Mutations</span>
                    {outsideSsms.length > 0 &&
                      <span style={{ float: 'right' }}>
                        <Tooltip
                          Component={
                            <div>
                              <div>
                                {outsideSsms.length}
                                {' '}
                                mutation
                                {outsideSsms.length > 1
                                  ? 's amino acid changes occur '
                                  : "'s amino acid change occurs "}
                                {' '}
                                outside of the annotated transcript's length.
                              </div>
                              <div style={{ marginTop: 5 }}>
                                <table style={{ width: '100%' }}>
                                  <thead>
                                    <tr>
                                      <th>AA Change</th>
                                      <th>Position</th>
                                      <th style={{ textAlign: 'right' }}>
                                        # Cases
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {outsideSsms.map(d =>
                                      <tr key={d.aa_change}>
                                        <td>{d.aa_change}</td>
                                        <td>{d.x}</td>
                                        <td style={{ textAlign: 'right' }}>
                                          {d.y}
                                        </td>
                                      </tr>,
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          }
                        >
                          <i
                            className="fa fa-warning"
                            style={{
                              color: 'rgb(215, 175, 33)',
                              cursor: 'pointer',
                            }}
                          />
                        </Tooltip>
                      </span>}
                  </div>
                  <div style={{ marginTop: '6px' }}>
                    <select
                      value={blacklist}
                      onChange={e => {
                        e.persist();
                        setState(s => ({ ...s, blacklist: e.target.value }));
                      }}
                      aria-label="Color by:"
                    >
                      <option value="consequence">Consequence</option>
                      <option value="impact" disabled={impactUnknown}>
                        Impact (VEP)
                      </option>
                    </select>
                  </div>
                  <div style={{ marginTop: '6px' }}>
                    <div
                      style={{
                        marginTop: '6px',
                        fontSize: '14px',
                      }}
                    >
                      <div>
                        <span
                          onClick={clearBlacklist}
                          style={{
                            color: 'rgb(27, 103, 145)',
                            cursor: 'pointer',
                          }}
                        >
                          Select All
                        </span>
                        <span>&nbsp;|&nbsp;</span>
                        <span
                          onClick={() => {
                            fillBlacklist(
                              Object.keys(
                                groupByType(blacklist, lolliplotData.mutations),
                              ),
                            );
                          }}
                          style={{
                            color: 'rgb(27, 103, 145)',
                            cursor: 'pointer',
                          }}
                        >
                          Deselect All
                        </span>
                      </div>
                    </div>
                    {Object.entries(
                      groupByType(blacklist, lolliplotData.mutations),
                    ).map(([variant, xs]) =>
                      <div
                        key={variant}
                        style={{
                          marginTop: '6px',
                          fontSize: '14px',
                        }}
                      >
                        <div>
                          <span
                            onClick={() => toggleBlacklistItem(variant)}
                            style={{
                              color: mutationColors[blacklist][variant],
                              textAlign: 'center',
                              border: '2px solid',
                              width: '23px',
                              cursor: 'pointer',
                              display: 'inline-block',
                              marginRight: '6px',
                            }}
                          >
                            {state[`${blacklist}Blacklist`].has(variant)
                              ? <span>&nbsp;</span>
                              : '✓'}
                          </span>
                          <span>{startCase(variant)}:</span>
                          <span style={{ float: 'right' }}>
                            <b>
                              {
                                // $FlowIgnore
                                xs
                                  .filter(d => d.x >= min && d.x <= max)
                                  .filter(filterByType(blacklist)).length
                              }
                            </b>
                            {/* $FlowIgnore */}
                            &nbsp;/ <b>{xs.length}</b>
                          </span>
                        </div>
                      </div>,
                    )}
                  </div>
                </div>
              </div>
            </Row>}
        </div>
      </Loader>
    </Column>,
);

export const LolliplotQuery = {
  initialVariables: {
    fetchSsms: false,
    score: 'occurrence.case.project.project_id',
    lolliplotGeneId: '',
    fetchGene: false,
    haveTotal: false,
    first: 10000,
    lolliplotFilters: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        node(id: $lolliplotGeneId) @include(if: $fetchGene) {
          ...on Gene {
            gene_id
            symbol
            canonical_transcript_id
            transcripts {
              hits(first: 99) {
                edges {
                  node {
                    is_canonical
                    transcript_id
                    length_amino_acid
                    domains {
                      hit_name
                      description
                      start
                      end
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    lolliplot: () => Relay.QL`
      fragment on ProteinMutations {
        dummy: data(first: 0 fields: ["ssm_id"])
        data (
          first: $first
          score: $score
          filters: $lolliplotFilters
          fields: [
            "ssm_id",
            "genomic_dna_change",
            "consequence.transcript.aa_change",
            "consequence.transcript.aa_start",
            "consequence.transcript.consequence_type",
            "consequence.transcript.is_canonical",
            "consequence.transcript.transcript_id",
            "consequence.transcript.annotation.impact",
            "consequence.transcript.gene.gene_id",
            "consequence.transcript.gene.symbol",
          ]
        ) @include(if: $fetchSsms)
      }
    `,
  },
};

export default Relay.createContainer(LolliplotComponent, LolliplotQuery);
