import React from 'react';
import { union, find } from 'lodash';
import Table, { Tr, Td, Th } from '@ncigdc/uikit/Table';

export default ({ mapping, field, data1, data2, result1, result2, Alias }) =>
  <div>
    <h2>{mapping[field]}</h2>
    <Table
      headings={[
        <Th>{mapping[field]}</Th>,
        <Th style={{ textAlign: 'right' }}># of items in <Alias i={1} /></Th>,
        <Th style={{ textAlign: 'right' }}>% in <Alias i={1} /></Th>,
        <Th style={{ textAlign: 'right' }}># of items in <Alias i={2} /></Th>,
        <Th style={{ textAlign: 'right' }}>% in <Alias i={2} /></Th>,
      ]}
      body={
        <tbody>
          {union(
            data1[field].buckets.map(b => b.key),
            data2[field].buckets.map(b => b.key),
          ).map((k, i) => {
            const set1_bucket =
              (find(data1[field].buckets, b => b.key === k) || {}).doc_count ||
              0;
            const set2_bucket =
              (find(data2[field].buckets, b => b.key === k) || {}).doc_count ||
              0;
            return (
              <Tr key={k} index={i}>
                <Td width={250}>{k}</Td>
                <Td style={{ textAlign: 'right' }}>{set1_bucket}</Td>
                <Td style={{ textAlign: 'right' }}>
                  {(set1_bucket / result1.hits.total * 100).toFixed(0)}%
                </Td>
                <Td style={{ textAlign: 'right' }}>{set2_bucket}</Td>
                <Td style={{ textAlign: 'right' }}>
                  {(set2_bucket / result2.hits.total * 100).toFixed(0)}%
                </Td>
              </Tr>
            );
          })}
        </tbody>
      }
    />
  </div>;
