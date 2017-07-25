import React from 'react';
import JSURL from 'jsurl';

import { setModal } from '@ncigdc/dux/modal';
import SelectModal from '@ncigdc/components/Modals/SelectModal';

export default function({ grid, setTooltip, trackLegends, push, dispatch }) {
  grid.on('gridMouseOver', data => {
    setTooltip(
      data.observation &&
        <div>
          <div>Case: {data.donor.displayId}</div>
          <div>Gene: {data.observation.geneSymbol}</div>
          <div>Mutation: {data.observation.id}</div>
          <div>Consequence: {data.observation.consequence}</div>
        </div>,
    );
  });
  grid.on('gridMouseOut', () => setTooltip());

  grid.on('gridCrosshairMouseOver', data => {
    setTooltip(
      <div>
        {data.donor && <div>Case: {data.donor.displayId}</div>}
        {data.gene && <div>Gene: {data.gene.symbol}</div>}
        {data.obs && <div>Mutations: {data.obs}</div>}
      </div>,
    );
  });
  grid.on('gridCrosshairMouseOut', () => setTooltip());

  grid.on('histogramMouseOver', data => {
    setTooltip(
      <div>
        {data.domain.symbol ? data.domain.symbol : data.domain.displayId}
        <br /> Count: {data.domain.count}<br />
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
        <div>
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
    type = type === 'donor' ? 'case' : type;
    push({
      pathname: '/exploration',
      query: {
        filters: JSURL.stringify({
          op: 'AND',
          content: [
            {
              op: 'IN',
              content: { field: `${type}s.${type}_id`, value: [id] },
            },
          ],
        }),
        facetTab: `${type}s`,
        searchTableTab: `${type}s`,
      },
    });
  });
  grid.on('gridClick', ({ observation: { id } }) => {
    push({
      pathname: '/exploration',
      query: {
        filters: JSURL.stringify({
          op: 'AND',
          content: [
            {
              op: 'IN',
              content: {
                field: 'ssms.ssm_id',
                value: [id],
              },
            },
          ],
        }),
        facetTab: 'mutations',
        searchTableTab: 'mutations',
      },
    });
  });

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
