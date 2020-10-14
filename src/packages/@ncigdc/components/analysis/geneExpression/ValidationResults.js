import { Row, Column } from '@ncigdc/uikit/Flex';
import WarningBox from '@ncigdc/uikit/WarningBox';

import './styles.scss';

const ValidationResults = ({
  instructions,
  styles,
  validationResults,
}) => (
  <Row
    className="validation-results"
    style={styles}
    >
    <Column style={{ flex: 1 }}>
      {instructions}

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
                <p>The amount of gene expression data available for visualization exceeds the display limit. Currently, the tool supports a maximum of 120,000 total rows and columns (for example 1,000 cases and 120 genes) to be displayed after clustering. Please try reducing your case and/or gene set sizes.</p>
                <p style={{ marginBottom: 0 }}>The GDC is actively exploring methods to increase this limit in future releases of the data portal.</p>
              </WarningBox>
            )}
          </React.Fragment>
        )
      )}
    </Column>
  </Row>
);

export default ValidationResults;
