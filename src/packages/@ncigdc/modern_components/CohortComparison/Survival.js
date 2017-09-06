import React from 'react';
import SurvivalPlotWrapper from '@ncigdc/components/SurvivalPlotWrapper';
import Table, { Tr, Td, Th } from '@ncigdc/uikit/Table';
import { Row } from '@ncigdc/uikit/Flex';

export default ({ survivalData, result1, result2, Set1, Set2 }) =>
  <span style={{ marginTop: 10 }}>
    <Row>
      <h2>Survival Analysis</h2>
    </Row>
    <div>
      <SurvivalPlotWrapper {...survivalData} height={240} />
      {survivalData.rawData &&
        <Table
          headings={[
            <Th>Cases included in Analysis</Th>,
            <Th style={{ textAlign: 'right' }}>
              # Cases
            </Th>,
            <Th style={{ textAlign: 'right' }}>%</Th>,
            <Th style={{ textAlign: 'right' }}>
              # Cases
            </Th>,
            <Th style={{ textAlign: 'right' }}>%</Th>,
          ]}
          body={
            <tbody>
              <Tr index={0}>
                <Td width={250}>Overall Survival Analysis</Td>
                <Td style={{ textAlign: 'right' }}>
                  {survivalData.rawData.results[0] &&
                    survivalData.rawData.results[0].donors.length}
                </Td>
                <Td style={{ textAlign: 'right' }}>
                  {survivalData.rawData.results[0] &&
                    (survivalData.rawData.results[0].donors.length /
                      result1.hits.total *
                      100).toFixed(0)}%
                </Td>
                <Td style={{ textAlign: 'right' }}>
                  {survivalData.rawData.results[1] &&
                    survivalData.rawData.results[1].donors.length}
                </Td>
                <Td style={{ textAlign: 'right' }}>
                  {survivalData.rawData.results[1] &&
                    (survivalData.rawData.results[1].donors.length /
                      result2.hits.total *
                      100).toFixed(0)}%
                </Td>
              </Tr>
            </tbody>
          }
        />}
    </div>
  </span>;
