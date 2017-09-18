import React from 'react';
import { startCase } from 'lodash';
import groupByType from '@ncigdc/utils/groupByType';
import Tooltip from '@ncigdc/uikit/Tooltip/Tooltip';

export default ({
  mutations,
  filterByType,
  blacklist,
  min,
  max,
  outsideSsms,
  setState,
  impactUnknown,
  clearBlacklist,
  fillBlacklist,
  toggleBlacklistItem,
  mutationColors,
  state,
  style,
}) => (
  <div id="mutation-stats" style={{ marginLeft: '20px', ...style }}>
    <div
      style={{
        border: '1px solid rgb(186, 186, 186)',
        padding: '13px',
      }}
    >
      <div>
        <span>
          Viewing{' '}
          {mutations
            .filter(d => d.x >= min && d.x <= max)
            .filter(filterByType(blacklist))
            .length.toLocaleString()}
        </span>
        <span> / </span>
        <span>{mutations.length.toLocaleString()} Mutations</span>
        {outsideSsms.length > 0 && (
          <span style={{ float: 'right' }}>
            <Tooltip
              Component={
                <div>
                  <div>
                    {outsideSsms.length.toLocaleString()} mutation
                    {outsideSsms.length > 1
                      ? 's amino acid changes occur '
                      : "'s amino acid change occurs "}{' '}
                    outside of the annotated transcript's length.
                  </div>
                  <div style={{ marginTop: 5 }}>
                    <table style={{ width: '100%' }}>
                      <thead>
                        <tr>
                          <th>AA Change</th>
                          <th>Position</th>
                          <th style={{ textAlign: 'right' }}># Cases</th>
                        </tr>
                      </thead>
                      <tbody>
                        {outsideSsms.map(d => (
                          <tr key={d.aa_change}>
                            <td>{d.aa_change}</td>
                            <td>{d.x}</td>
                            <td style={{ textAlign: 'right' }}>{d.y}</td>
                          </tr>
                        ))}
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
          </span>
        )}
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
                fillBlacklist(Object.keys(groupByType(blacklist, mutations)));
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
          groupByType(blacklist, mutations),
        ).map(([variant, xs]) => (
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
                {state[`${blacklist}Blacklist`].has(variant) ? (
                  <span>&nbsp;</span>
                ) : (
                  '✓'
                )}
              </span>
              <span>{startCase(variant)}:</span>
              <span style={{ float: 'right' }}>
                <b>
                  {// $FlowIgnore
                  xs
                    .filter(d => d.x >= min && d.x <= max)
                    .filter(filterByType(blacklist))
                    .length.toLocaleString()}
                </b>
                {/* $FlowIgnore */}
                &nbsp;/ <b>{xs.length.toLocaleString()}</b>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
