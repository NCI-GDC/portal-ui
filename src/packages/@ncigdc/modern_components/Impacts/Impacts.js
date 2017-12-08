import React from 'react';
import { compose } from 'recompose';
import { get, uniq } from 'lodash';

import { withTheme } from '@ncigdc/theme';
import withRouter from '@ncigdc/utils/withRouter';
import GreyBox from '@ncigdc/uikit/GreyBox';
import Toggle from '@ncigdc/uikit/Toggle';
import { IMPACT_SHORT_FORMS } from '@ncigdc/utils/constants';
import BubbleIcon from '@ncigdc/theme/icons/BubbleIcon';
import { Row, Column } from '@ncigdc/uikit/Flex';

type TImpacts = {
  polyphen_impact: string,
  polyphen_score: number,
  sift_impact: string,
  sift_score: number,
  impact: string,
};

export const makeBubbles = (impacts: TImpacts, theme) =>
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

export default compose(withRouter, withTheme)(({ explore, loading, theme }) => {
  const impacts = get(
    explore,
    'ssms.hits.edges[0].node.consequence.hits.edges',
    [],
  ).map(({ node }) => ({
    is_canonical: node.transcript.is_canonical,
    ...node.transcript.annotation,
    vep_impact: node.transcript.annotation.impact,
  }));

  const canonicalImpact = impacts.find(({ is_canonical }) => is_canonical);
  const veps = uniq(impacts.map(({ vep_impact }) => vep_impact)).filter(
    impact => impact !== canonicalImpact.vep_impact,
  );
  const sifts = uniq(impacts.map(({ sift_impact }) => sift_impact)).filter(
    impact => impact !== canonicalImpact.sift_impact,
  );
  const polyphens = uniq(
    impacts.map(({ polyphen_impact }) => polyphen_impact),
  ).filter(impact => impact !== canonicalImpact.polyphen_impact);
  const condensed = impacts
    .map((_, index) => ({
      vep_impact: veps[index],
      sift_impact: sifts[index],
      polyphen_impact: polyphens[index],
    }))
    .filter(
      ({ vep_impact, sift_impact, polyphen_impact }) =>
        vep_impact || sift_impact || polyphen_impact,
    );
  return (
    <span>
      {loading && impacts.length ? (
        <GreyBox style={{ width: '70px' }} />
      ) : (
        <Toggle
          title={
            canonicalImpact ? (
              makeBubbles(canonicalImpact, theme)
            ) : (
              <GreyBox style={{ width: '70px' }} />
            )
          }
        >
          {condensed.length > 0 && (
            <Column>
              {condensed.map((impact, index) => (
                <Row key={index}>{makeBubbles(impact, theme)}</Row>
              ))}
            </Column>
          )}
        </Toggle>
      )}
    </span>
  );
});
