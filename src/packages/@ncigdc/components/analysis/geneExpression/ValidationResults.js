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
        validationResults.status === 'error'
          ? (
            <WarningBox>
              There was an error with your query. Please try again later.
            </WarningBox>
          )
        : (
          <React.Fragment>
            <ul className="results-list">
              {validationResults.casesData.withGE > 0 && (
                <li>
                  <i className="fa fa-check-circle green" />
                  <span className="numbers">{validationResults.casesData.withGE}</span>
                  {` case${
                    validationResults.casesData.withGE === 1 ? ' has' : 's have'
                    } expression data in ${
                    validationResults.geneCoverage
                    } of the selected genes.`}
                </li>
              )}

              {validationResults.casesData.withoutGE > 0 && (
                <li>
                  <i className="fa fa-exclamation-triangle yellow" />
                  <span className="numbers">{validationResults.casesData.withoutGE}</span>
                  {` case${
                    validationResults.casesData.withoutGE === 1 ? ' has' : 's have'
                    } expression data in none of the selected genes.`}
                </li>
              )}
            </ul>

            {validationResults.status === 'notEnough' && (
              <WarningBox>
                The amount of gene expression data does not meet the minimum required for display.
                <br />
                A minimum of 25 total rows and columns (for example 5 cases and 5 genes) is required.
                <br />
                Please modify your sets.
              </WarningBox>
            )}

            {validationResults.status === 'tooMany' && (
              <WarningBox>
                The amount of gene expression data exceeds the display limit.
                Please reduce your set sizes.
              </WarningBox>
            )}
          </React.Fragment>
        )
      )}
    </Column>
  </Row>
);

export default ValidationResults;
