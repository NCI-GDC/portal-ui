import { Row, Column } from '@ncigdc/uikit/Flex';
import WarningBox from '@ncigdc/uikit/WarningBox';

import './styles.scss';

const ValidationResults = ({
  styles,
  validationResults,
}) => (
  <Row
    className="validation-results"
    style={styles.rowStyle}
    >
    <Column style={{ flex: 1 }}>
      <h2
        style={{
          color: '#c7254e',
          fontSize: '1.8rem',
        }}
        >
        Step 3: Check available data
      </h2>

      <p style={{ marginBottom: 15 }}>
        Check if your input sets have gene expression data available before running the analysis.
      </p>

      {validationResults && (
        validationResults.analysis === 'tooMany'
          ? (
            <WarningBox>
              The amount of gene expression data exceeds the display limit.
              Please reduce your set sizes.
            </WarningBox>
          )
        : validationResults.analysis === 'notEnough'
          ? (
            <WarningBox>
              The amount of gene expression data does not meet the minimum required for display.
              Please increase your set sizes.
            </WarningBox>
          )
        : (
          <ul className="results-list">
            <li>
              <i className="fa fa-check-circle green" />
              <span className="numbers">{validationResults.data.withGE}</span>
              {` case${
                validationResults.data.withGE === 1 ? ' has' : 's have'
                } expression data in ${
                validationResults.analysis === 'some' ? 'some' : 'all'
                } of the selected genes.`}
            </li>

            <li>
              <i className="fa fa-exclamation-triangle yellow" />
              <span className="numbers">{validationResults.data.withoutGE}</span>
              {` case${
                validationResults.data.withoutGE === 1 ? ' has' : 's have'
                } expression data in none of the selected genes.`}
              {/* {` case${
                validationResults.withGE === 1 ? ' has' : 's have'
                } no expression data in any of the selected genes.`} */}
              {/* {` case${
                  validationResults.withoutGE === 0
                    ? 's have no'
                    : `${validationResults.withoutGE > 1 ? 's do' : ' does'} not have`
                } expression data in any of the selected genes.`} */}
            </li>
          </ul>
        )
      )}
    </Column>
  </Row>
);

export default ValidationResults;
