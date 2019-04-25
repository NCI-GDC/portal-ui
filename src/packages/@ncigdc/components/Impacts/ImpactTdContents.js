/* @flow */
import React from 'react';
import { compose } from 'recompose';

import { withTheme } from '@ncigdc/theme';
import BubbleIcon from '@ncigdc/theme/icons/BubbleIcon';
import { Row } from '@ncigdc/uikit/Flex';
import { IMPACT_SHORT_FORMS } from '@ncigdc/utils/constants';
import { ForTsvExport } from '@ncigdc/components/DownloadTableToTsvButton';

type TImpacts = {
  polyphen_impact: string,
  polyphen_score: number,
  sift_impact: string,
  sift_score: number,
  vep_impact: string,
};

const makeBubbles = (impacts: TImpacts, theme) =>
  ['VEP', 'SIFT', 'PolyPhen'].map(impactType => {
    const impact = impacts[`${impactType.toLowerCase()}_impact`];
    const impactScore = impacts[`${impactType.toLowerCase()}_score`];
    const tipTextImpact = `${impactType} Impact: ${impact}`;
    const tipTextScore = `${impactType} score: ${impactScore}`;
    const tipText = [
      tipTextImpact,
      ...(impactScore >= 0 && impactType !== 'VEP' ? [tipTextScore] : []),
    ].join(' / ');
    return impact ? (
      <BubbleIcon
        key={tipText}
        toolTipText={tipText}
        text={
          IMPACT_SHORT_FORMS[impactType.toLowerCase()][impact.toLowerCase()] ||
          ''
        }
        backgroundColor={theme[impactType.toLowerCase()][impact.toLowerCase()]}
      />
    ) : (
      <BubbleIcon
        key={tipText}
        toolTipText=""
        text="--"
        style={{ color: theme.greyScale1, width: '27px' }}
      />
    );
  });

export const ImpactTdContents = compose(
  withTheme,
)(({ node, theme }: { node: TImpacts, theme: Object }) => (
  <Row
    style={{
      display: 'flex',
      justifyContent: 'space-between',
    }}
  >
    {makeBubbles(node, theme)}
    <ForTsvExport>
      {[
        `VEP: ${node.vep_impact}`,
        ...(node.sift_impact
          ? [`SIFT: ${node.sift_impact} - score ${node.sift_score}`]
          : []),
        ...(node.polyphen_impact
          ? [`PolyPhen: ${node.polyphen_impact} - score ${node.polyphen_score}`]
          : []),
      ].join(', ')}
    </ForTsvExport>
  </Row>
));

export default ImpactTdContents;
