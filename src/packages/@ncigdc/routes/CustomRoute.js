/* @flow */

import React from 'react';
import { compose, withState } from 'recompose';
import { parse } from 'query-string';
import Route from 'react-router/Route';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Column } from '@ncigdc/uikit/Flex';
import Components from '@ncigdc/modern_components';
import ComponentList from './edit_mode/ComponentList';
import { Zone, EmptyZone } from './edit_mode/Zone';

export default (
  <Route
    path="/custom"
    component={compose(
      DragDropContext(HTML5Backend),
      withState('zones', 'setZones', [
        {
          type: 'GenesTable',
          userProps: {},
        },
        {
          type: 'GeneSymbol',
          userProps: {},
        },
      ]),
    )(({ location, zones, setZones }) => {
      const { edit } = parse(location.search);
      return (
        <div
          style={{
            maxWidth: '1600px',
            padding: '85px 100px 90px',
          }}
        >
          {edit && <ComponentList pathname={location.pathname} edit={edit} />}
          <div style={{ marginLeft: edit ? 220 : 0 }}>
            <Column spacing="2rem">
              {zones.map((component, i) => {
                const Component = Components[component.type];

                return (
                  <Zone
                    key={i}
                    zoneIndex={i}
                    edit={edit}
                    propTypes={Component.propTypes}
                    component={component}
                    changeProp={({ zoneIndex, prop, value }) =>
                      setZones(zones =>
                        zones.map((z, i) => {
                          if (i !== zoneIndex) return z;
                          return {
                            ...z,
                            userProps: {
                              ...z.userProps,
                              [prop]: value,
                            },
                          };
                        }),
                      )}
                    remove={() =>
                      setZones(zones => [
                        ...zones.slice(0, i),
                        ...zones.slice(i + 1),
                      ])}
                  >
                    <Component {...component.userProps} />
                  </Zone>
                );
              })}
            </Column>
            {edit &&
              <div style={{ marginTop: '2rem' }}>
                <EmptyZone setZones={setZones} />
              </div>}
          </div>
        </div>
      );
    })}
  />
);
