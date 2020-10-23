import {
  compose,
  pure,
  setDisplayName,
  withHandlers,
  withState,
} from 'recompose';

import UnstyledButton from '@ncigdc/uikit/UnstyledButton';

const DemoDescription = ({
  showDataSelectionSteps,
  showLess,
  showMore,
}) => {
  const ExtraInstructionsButton = ({ command }) => (
    <UnstyledButton
      data-test={`show-${command}`}
      onClick={command === 'more' ? showMore : showLess}
      style={{
        alignItems: 'center',
        color: '#005083',
        display: 'flex-inline',
        fontSize: '1.3rem',
      }}
      >
      {`Show ${command}...`}
    </UnstyledButton>
  );

  return (
    <section
      style={{
        marginBottom: '1rem',
      }}
      >
      <p style={{ fontStyle: 'italic' }}>
        Demo showing the heatmap and the clustering of 150 most variably expressed protein-coding genes from 150 cases of testicular cancer.
      </p>

      <p>
        <strong>Data used in this demo:</strong>
        {' Protein-coding genes analyzed for all 150 cases in the TCGA-TGCT project were selected. The '}

        <a
          href="https://pypi.org/project/HTSeq/"
          rel="noopener noreferrer"
          target="_blank"
          >
          HTSeq
        </a>

        {' Python package was used to count the reads mapped to each gene (using the GDC\'s BAM files as input). '}

        {showDataSelectionSteps
          ? (
            <React.Fragment>
              {'Genes with low expression were removed using the following threshold for mean HTSeq count and mean TPM (transcripts per million): [mean(readCount) > 10] AND [mean(log2(TPM+1) > 3]. Alternatively, HTSeq\'s '}

              <a
                href="https://docs.gdc.cancer.gov/Encyclopedia/pages/HTSeq-FPKM-UQ/"
                rel="noopener noreferrer"
                target="_blank"
                >
                FPKM-UQ
              </a>

              {' normalization method can be applied before removing low expression genes. However, for simplicity in generating this example, only the unnormalized HTSeq counts were used. Next, the top 5000 genes with the highest standard deviation (SD) were selected. These 5000 genes were then ranked from highest to lowest by coefficient of variation (SD divided by mean). The top 150 genes from this ranking were selected as the final gene set used to plot the heatmap. Expression data is median-centred and clustered before visualization. The case and gene sets used for this demo can be viewed and downloaded via the links to the Exploration Page in the summary panel below. '}

              <ExtraInstructionsButton command="less" />
            </React.Fragment>
          )
          : <ExtraInstructionsButton command="more" />}
      </p>

      <p>
        <strong>COMING SOON:</strong>
        {' Filter genes by expression level, and select genes that are highly variable.'}
      </p>
      <p>
        {'Please send us your feedback at: '}
        <a
          href="mailto:support@nci-gdc.datacommons.io"
          rel="noopener noreferrer"
          target="_blank"
          >
          support@nci-gdc.datacommons.io
        </a>
      </p>
    </section>
  );
};

export default compose(
  setDisplayName('EnhancedDemoDescription'),
  withState('showDataSelectionSteps', 'setShowDataSelectionSteps', false),
  withHandlers({
    showLess: ({
      setShowDataSelectionSteps,
    }) => () => setShowDataSelectionSteps(false),
    showMore: ({
      setShowDataSelectionSteps,
    }) => () => setShowDataSelectionSteps(true),
  }),
  pure,
)(DemoDescription);
