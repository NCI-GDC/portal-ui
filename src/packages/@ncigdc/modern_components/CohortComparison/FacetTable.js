import React from 'react';
import { union, find } from 'lodash';
import Table, { Tr, Td, Th } from '@ncigdc/uikit/Table';
import { Row } from '@ncigdc/uikit/Flex';

export default ({
  mapping,
  field,
  data1,
  data2,
  result1,
  result2,
  Set1,
  Set2,
}) =>
  <div>
    <Row>
      <h2>{mapping[field]}</h2>
      <Row style={{ marginLeft: 'auto', alignItems: 'center' }}>
        <div>{Set1}</div>
        <div style={{ margin: '0 65px' }}>{Set2}</div>
      </Row>
    </Row>
    <Table
      headings={[
        <Th>{mapping[field]}</Th>,
        <Th style={{ textAlign: 'right' }}># Cases</Th>,
        <Th style={{ textAlign: 'right' }}>%</Th>,
        <Th style={{ textAlign: 'right' }}># Cases</Th>,
        <Th style={{ textAlign: 'right' }}>%</Th>,
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
