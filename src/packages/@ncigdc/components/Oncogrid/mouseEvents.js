import React from 'react';

import { stringifyJSONParam } from '@ncigdc/utils/uri';
import { setModal } from '@ncigdc/dux/modal';
import SelectModal from '@ncigdc/components/Modals/SelectModal';

export default function({
  grid,
  setTooltip,
  trackLegends,
  push,
  dispatch,
  currentFilters,
}) {
  grid.on('gridMouseOver', data => {
    if (!data.observation) return;
    const cnvData = data.observation.filter(o => o.type === 'cnv');
    const ssmData = data.observation.filter(o => o.type === 'mutation');
    setTooltip(
      <div style={{ maxWidth: 800 }}>
        {data.donor && (
          <div>
            <span style={{ fontWeight: 'bold' }}>Case:</span>{' '}
            {data.donor.displayId}
          </div>
        )}
        {data.gene && (
          <div style={{ marginTop: 2 }}>
            <span style={{ fontWeight: 'bold' }}>Gene:</span> {data.gene.symbol}
          </div>
        )}
        <div style={{ marginTop: 2 }}>
          {!!cnvData.length && (
            <span>
              <span style={{ fontWeight: 'bold' }}>CNV change:</span>
              <span> {cnvData[0].cnvChange}</span>
            </span>
          )}
          {!!ssmData.length && (
            <div style={{ marginTop: 2 }}>
              <div>
                <span style={{ fontWeight: 'bold' }}>Number of mutations:</span>
              </div>
              {ssmData.map((ssm, i) => (
                <div key={i} style={{ marginLeft: 5 }}>
                  {ssm.consequence}: <span>{ssm.ids.length}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>,
    );
  });

  grid.on('gridMouseOut', () => setTooltip());

  grid.on('gridCrosshairMouseOver', data => {
    setTooltip(
      <div style={{ maxWidth: 800 }}>
        {data.donor && <div>Case: {data.donor.displayId}</div>}
        {data.gene && <div>Gene: {data.gene.symbol}</div>}
      </div>,
    );
  });
  grid.on('gridCrosshairMouseOut', () => setTooltip());

  grid.on('histogramMouseOver', data => {
    setTooltip(
      <div style={{ maxWidth: 800 }}>
        {data.domain.symbol ? data.domain.symbol : data.domain.displayId}
        <br /> Count: {data.domain.count}
        <br />
      </div>,
    );
  });

  grid.on('cnvHistogramMouseOver', data => {
    setTooltip(
      <div style={{ maxWidth: 800 }}>
        {data.domain.symbol ? data.domain.symbol : data.domain.displayId}
        <br /> cnv: {data.domain.cnv}
        <br />
      </div>,
    );
  });

  grid.on('histogramMouseOut', () => setTooltip());

  grid.on(
    'trackMouseOver',
    ({
      domain: {
        displayId,
        displayName,
        displayValue,
        notNullSentinel,
        type,
        fieldName,
      },
    }) => {
      setTooltip(
        <div style={{ maxWidth: 800 }}>
          <div>{displayId}</div>
          {displayName}: {displayValue.toString()}
          {type === 'age'
            ? ' days'
            : type === 'bool' && fieldName !== 'cgc' ? ' files' : ''}
        </div>,
      );
    },
  );
  grid.on('trackMouseOut', () => setTooltip());

  grid.on('trackLegendMouseOver', ({ group }) => {
    setTooltip(
      <div dangerouslySetInnerHTML={{ __html: trackLegends[group] }} />,
    );
  });
  grid.on('trackLegendMouseOut', () => setTooltip());

  grid.on('trackClick', ({ domain: { id }, type }) => {
    push(`/${type === 'donor' ? 'cases' : 'genes'}/${id}`);
  });
  grid.on('histogramClick', ({ domain: { id }, type }) => {
    const gdcType = type === 'donor' ? 'case' : type;
    push({
      pathname: '/exploration',
      query: {
        filters: stringifyJSONParam({
          op: 'AND',
          content: [
            {
              op: 'IN',
              content: { field: `${gdcType}s.${gdcType}_id`, value: [id] },
            },
            ...currentFilters.content,
          ],
        }),
        facetTab: `${gdcType}s`,
        searchTableTab: `${gdcType}s`,
      },
    });
  });

  grid.on(
    'gridClick',
    ({ observation: { donorId, consequence, type, cnv_change, geneId } }) => {
      let facetTab = 'mutations';
      let searchTableTab = 'mutations';
      let typeField = 'ssms.consequence.transcript.consequence_type';
      let typeValue = consequence;

      if (type === 'cnv') {
        facetTab = 'genes';
        searchTableTab = 'genes';
        typeField = ''; // tbd
        typeValue = cnv_change;
      }

      push({
        pathname: '/exploration',
        query: {
          filters: stringifyJSONParam({
            op: 'AND',
            content: [
              {
                op: 'IN',
                content: {
                  field: 'cases.case_id',
                  value: [donorId],
                },
              },
              {
                op: 'IN',
                content: {
                  field: typeField,
                  value: [typeValue],
                },
              },
              {
                op: 'IN',
                content: {
                  field: 'genes.gene_id',
                  value: [geneId],
                },
              },
            ],
          }),
          facetTab,
          searchTableTab,
        },
      });
    },
  );

  grid.on('addTrackClick', ({ hiddenTracks, addTrack }) => {
    dispatch(
      setModal(
        <SelectModal
          options={hiddenTracks}
          onClose={(tracks = []) => {
            dispatch(setModal(null));
            if (tracks.length) addTrack(tracks);
          }}
        />,
      ),
    );
  });
}
