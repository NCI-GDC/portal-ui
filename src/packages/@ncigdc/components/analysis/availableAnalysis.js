import { VennSvg } from '@ncigdc/components/Charts/Venn';
import Link from '@ncigdc/components/Links/Link';
import CohortComparison from '@ncigdc/modern_components/CohortComparison';
import CCIcon from '@ncigdc/theme/icons/CohortComparisonIcon';
import { withTheme } from '@ncigdc/theme';
import ClinicalDataAnalysis from '@ncigdc/theme/icons/ClinicalDataAnalysis';
import { TSetTypes } from '@ncigdc/dux/sets';
import ClinicalAnalysisContainer from '@ncigdc/modern_components/IntrospectiveType';
import { DISPLAY_SCRNA_SEQ } from '@ncigdc/utils/constants';
import GeneExpressionContainer from '@ncigdc/modern_components/GeneExpression';
import SCRNASeq from '@ncigdc/theme/icons/SCRNASeq';
import SCRNASeqContainer from '@ncigdc/modern_components/SCRNASeq';
import GeneExpression from '@ncigdc/theme/icons/GeneExpression';
import { fetchApi } from '@ncigdc/utils/ajax';

import Demo from './Demo';
import SetOperations from './SetOperations';
import defaultVariables from './defaultCDAVEvariables';
import { validateGeneExpressionAvailability } from './geneExpression/helpers';

export type TSelectedSets = {
  [TSetTypes]: any,
};

type TAnalysis = {
  type: string,
  title: string,
  Icon: ReactComponent<*>,
  description: string | ReactComponent<*>,
  demoData: {
    sets: TSelectedSets,
    filters: {},
    type: string,
  },
  introText: string | ReactComponent<*>,
  setInstructions: string,
  setDisabledMessage: (opts: { sets: TSelectedSets, type: string }) => ?string,
  setTypes: Array<string>,
  ResultComponent: ReactComponent<*>,
  validateSets: (TSelectedSets) => boolean,
};

/* Note on demo sets:
 * Whenever a set is created (programatically or by user input), it cannot currently be deleted
 * and it must either be modified, or abandoned, should changes be required.
 * i.e. if you want to change a demo set, you should choose a new name every time.
 */

const availableAnalysis: [TAnalysis] = [
  // Set Operations
  {
    demoData: {
      filters: {
        'demo-bladder-high-muse': {
          content: [
            {
              content: {
                field: 'cases.primary_site',
                value: ['Bladder'],
              },
              op: 'in',
            },
            {
              content: {
                field: 'ssms.consequence.transcript.annotation.vep_impact',
                value: ['HIGH'],
              },
              op: 'in',
            },
            {
              content: {
                field:
                  'ssms.occurrence.case.observation.variant_calling.variant_caller',
                value: ['muse'],
              },
              op: 'in',
            },
          ],
          op: 'and',
        },
        'demo-bladder-high-mutect2': {
          content: [
            {
              content: {
                field: 'cases.primary_site',
                value: ['Bladder'],
              },
              op: 'in',
            },
            {
              content: {
                field: 'ssms.consequence.transcript.annotation.vep_impact',
                value: ['HIGH'],
              },
              op: 'in',
            },
            {
              content: {
                field:
                  'ssms.occurrence.case.observation.variant_calling.variant_caller',
                value: ['mutect2'],
              },
              op: 'in',
            },
          ],
          op: 'and',
        },
        'demo-bladder-high-varscan2': {
          content: [
            {
              content: {
                field: 'cases.primary_site',
                value: ['Bladder'],
              },
              op: 'in',
            },
            {
              content: {
                field: 'ssms.consequence.transcript.annotation.vep_impact',
                value: ['HIGH'],
              },
              op: 'in',
            },
            {
              content: {
                field:
                  'ssms.occurrence.case.observation.variant_calling.variant_caller',
                value: ['varscan2'],
              },
              op: 'in',
            },
          ],
          op: 'and',
        },
      },
      message:
        'Demo showing high impact mutations overlap in Bladder between Mutect, Varscan and Muse pipelines',
      sets: {
        ssm: {
          'demo-bladder-high-muse': 'Bladder, High impact, Muse',
          'demo-bladder-high-mutect2': 'Bladder, High impact, Mutect2',
          'demo-bladder-high-varscan2': 'Bladder, High impact, Varscan2',
        },
      },
      type: 'set_operations',
    },
    description:
      'Display Venn diagram and find intersection or union, etc. of your sets of the same type.',
    Icon: ({ style = {}, ...props }) => (
      <VennSvg
        {...props}
        getFillColor={(d, i) => (
          d.op === 5
          ? 'rgba(38, 166, 166, 0.65)'
          : d.op === 6
          ? 'rgba(235, 233, 46, 0.79)'
          : d.op === 7
          ? 'rgba(175, 58, 215, 0.8)'
          : 'rgba(0,0,0,0)'
        )}
        numCircles={3}
        ops={[
          { op: 1 },
          { op: 2 },
          { op: 3 },
          { op: 4 },
          { op: 5 },
          { op: 6 },
          { op: 7 },
        ]}
        outlineColour="rgba(46, 90, 164, 0.62)"
        style={{
          width: 80,
          ...style,
        }}
        />
    ),
    label: 'Set Operations',
    ResultComponent: props => {
      const type = [
        'case',
        'gene',
        'ssm',
      ].find(t => props.sets[t]);

      return props.id.includes('demo-')
        ? (
          <Demo {...props}>
            <SetOperations
              id={props.id}
              message={props.message}
              sets={props.sets[type]}
              type={type}
              />
          </Demo>
        )
        : (
          <SetOperations
            id={props.id}
            message={props.message}
            sets={props.sets[type]}
            type={type}
            />
        );
    },
    setDisabledMessage: ({ sets, type }) => (
      [
        'case',
        'gene',
        'ssm',
      ].filter(t => t !== type).some(t => sets[t])
        ? 'Please choose only one type'
        : Object.keys(sets[type] || {}).length >= 3
        ? `Please select two or three ${
            type === 'ssm' ? 'mutation' : type
          } sets`
        : null),
    setInstructions: 'Select 2 or 3 of the same set type',
    setTypes: [
      'case',
      'gene',
      'ssm',
    ],
    type: 'set_operations',
    validateSets: sets => {
      const entries = Object.entries(sets);
      return (
        entries.length === 1 && // can only have one type
        ( // must have 2 or 3 sets selected
          [2, 3].some(validSelections =>
            Object.keys(entries[0][1]).length === validSelections)
        )
      );
    },
  },
  // Cohort Comparison
  {
    demoData: {
      filters: {
        'demo-pancreas-kras': {
          content: [
            {
              content: {
                field: 'genes.symbol',
                value: ['KRAS'],
              },
              op: 'in',
            },
            {
              content: {
                field: 'cases.primary_site',
                value: ['Pancreas'],
              },
              op: 'in',
            },
          ],
          op: 'and',
        },
        'demo-pancreas-no-kras': {
          content: [
            {
              content: {
                field: 'genes.symbol',
                value: 'KRAS',
              },
              op: 'excludeifany',
            },
            {
              content: {
                field: 'cases.primary_site',
                value: ['Pancreas'],
              },
              op: 'in',
            },
          ],
          op: 'and',
        },
      },
      message:
        'Demo showing cases with pancreatic cancer with and without mutations in the gene KRAS.',
      sets: {
        case: {
          'demo-pancreas-kras': 'Pancreas - KRAS mutated',
          'demo-pancreas-no-kras': 'Pancreas - KRAS not mutated',
        },
      },
      type: 'comparison',
    },
    description: `Display the survival analysis of your case sets and compare
    characteristics such as gender, vital status and age at diagnosis.`,
    Icon: withTheme(({ theme, style = {} }) => (
      <div>
        <CCIcon
          color1="rgb(105, 16, 48)"
          color2={theme.primary}
          height="80px"
          style={style}
          width="80px"
          />
      </div>
    )),
    label: 'Cohort Comparison',
    ResultComponent: props => (props.id.includes('demo-')
      ? (
        <Demo {...props}>
          <CohortComparison message={props.message} sets={props.sets} />
        </Demo>
      )
      : (
        <CohortComparison message={props.message} sets={props.sets} />
      )
    ),
    setDisabledMessage: ({ sets, type }) => (!['case'].includes(type)
        ? 'This analysis can\'t be run with this type'
        : Object.keys(sets[type] || {}).length >= 2
        ? `You can only select two ${type === 'ssm' ? 'mutation' : type} set`
        : null),
    setInstructions: 'Select 2 case sets',
    setTypes: ['case'],
    type: 'comparison',
    validateSets: sets => ['case'].every((t: any) => Object.keys(sets[t] || {}).length === 2),
  },
  // Clinical Data Analysis
  {
    demoData: {
      displayVariables: { ...defaultVariables },
      filters: {
        'demo-pancreas': {
          content: [
            {
              content: {
                field: 'cases.primary_site',
                value: ['Pancreas'],
              },
              op: 'in',
            },
          ],
          op: 'and',
        },
      },
      message: 'Demo showing cases with pancreatic cancer',
      name: 'Demo Clinical Analysis',
      sets: {
        case: {
          'demo-pancreas': 'Pancreas',
        },
      },
      type: 'clinical_data',
    },
    description: 'Display basic statistical analyses for the selected case set.',
    Icon: withTheme(({ theme, style = {} }) => (
      <div>
        <ClinicalDataAnalysis
          style={{
            width: 80,
            height: 80,
            ...style,
          }}
          />
      </div>
    )),
    label: 'Clinical Data Analysis',
    ResultComponent: props => (props.id.includes('demo-')
      ? (
        <Demo {...props}>
          <ClinicalAnalysisContainer typeName="ExploreCases" {...props} />
        </Demo>
      )
      : (
        <ClinicalAnalysisContainer
          typeName="ExploreCases"
          {...props}
          />
      )
    ),
    setTypes: ['case'],
    type: 'clinical_data',
    validateSets: sets => sets &&
      ['case'].every((t: any) => Object.keys(sets[t] || {}).length === 1),
  },
  // Gene Expression
  {
    demoData: {
      filters: {
        'tcga-tgct--all-cases--test2': {
          content: [
            {
              content: {
                field: 'cases.project.project_id',
                value: ['TCGA-TGCT'],
              },
              op: 'in',
            },
          ],
          op: 'and',
        },
        'tcga-tgct--top-50-pc-genes--test2': {
          content: [
            {
              content: {
                field: 'genes.gene_id',
                value: [
                  'ENSG00000181449',
                  'ENSG00000007350',
                  'ENSG00000132972',
                  'ENSG00000204644',
                  'ENSG00000125207',
                  'ENSG00000133063',
                  'ENSG00000118137',
                  'ENSG00000139219',
                  'ENSG00000149948',
                  'ENSG00000176566',
                  'ENSG00000153707',
                  'ENSG00000101443',
                  'ENSG00000185792',
                  'ENSG00000242950',
                  'ENSG00000147257',
                  'ENSG00000187556',
                  'ENSG00000241186',
                  'ENSG00000187690',
                  'ENSG00000143320',
                  'ENSG00000175928',
                  'ENSG00000101076',
                  'ENSG00000076716',
                  'ENSG00000205358',
                  'ENSG00000142182',
                  'ENSG00000185686',
                  'ENSG00000124839',
                  'ENSG00000160224',
                  'ENSG00000159224',
                  'ENSG00000185559',
                  'ENSG00000106483',
                  'ENSG00000117215',
                  'ENSG00000110900',
                  'ENSG00000143850',
                  'ENSG00000157399',
                  'ENSG00000255192',
                  'ENSG00000156959',
                  'ENSG00000169851',
                  'ENSG00000120949',
                  'ENSG00000100721',
                  'ENSG00000137077',
                  'ENSG00000163347',
                  'ENSG00000143995',
                  'ENSG00000125398',
                  'ENSG00000189334',
                  'ENSG00000102021',
                  'ENSG00000171388',
                  'ENSG00000011677',
                  'ENSG00000183117',
                  'ENSG00000204538',
                  'ENSG00000262406',
                  'ENSG00000143452',
                  'ENSG00000166482',
                  'ENSG00000143768',
                  'ENSG00000130513',
                  'ENSG00000161249',
                  'ENSG00000169594',
                  'ENSG00000139263',
                  'ENSG00000141448',
                  'ENSG00000099399',
                  'ENSG00000183098',
                  'ENSG00000163283',
                  'ENSG00000214575',
                  'ENSG00000167244',
                  'ENSG00000159251',
                  'ENSG00000237541',
                  'ENSG00000133169',
                  'ENSG00000171345',
                  'ENSG00000145113',
                  'ENSG00000013297',
                  'ENSG00000138622',
                  'ENSG00000175084',
                  'ENSG00000105370',
                  'ENSG00000151892',
                  'ENSG00000262655',
                  'ENSG00000113083',
                  'ENSG00000152137',
                  'ENSG00000111319',
                  'ENSG00000196350',
                  'ENSG00000138829',
                  'ENSG00000075673',
                  'ENSG00000139351',
                  'ENSG00000189184',
                  'ENSG00000243709',
                  'ENSG00000197380',
                  'ENSG00000105664',
                  'ENSG00000133048',
                  'ENSG00000163239',
                  'ENSG00000142677',
                  'ENSG00000180340',
                  'ENSG00000203907',
                  'ENSG00000101871',
                  'ENSG00000114315',
                  'ENSG00000168505',
                  'ENSG00000156049',
                  'ENSG00000163431',
                  'ENSG00000135253',
                  'ENSG00000166426',
                  'ENSG00000163530',
                  'ENSG00000104332',
                  'ENSG00000197565',
                  'ENSG00000107105',
                  'ENSG00000196878',
                  'ENSG00000049540',
                  'ENSG00000138685',
                  'ENSG00000123096',
                  'ENSG00000126016',
                  'ENSG00000149294',
                  'ENSG00000113739',
                  'ENSG00000130182',
                  'ENSG00000100842',
                  'ENSG00000064886',
                  'ENSG00000163508',
                  'ENSG00000112183',
                  'ENSG00000166450',
                  'ENSG00000157851',
                  'ENSG00000086548',
                  'ENSG00000197653',
                  'ENSG00000185070',
                  'ENSG00000189143',
                  'ENSG00000111799',
                  'ENSG00000123094',
                  'ENSG00000198729',
                  'ENSG00000004776',
                  'ENSG00000106571',
                  'ENSG00000182111',
                  'ENSG00000006283',
                  'ENSG00000170748',
                  'ENSG00000244486',
                  'ENSG00000145147',
                  'ENSG00000154027',
                  'ENSG00000166527',
                  'ENSG00000232629',
                  'ENSG00000112273',
                  'ENSG00000162949',
                  'ENSG00000115963',
                  'ENSG00000091513',
                  'ENSG00000203909',
                  'ENSG00000113430',
                  'ENSG00000046653',
                  'ENSG00000221890',
                  'ENSG00000131096',
                  'ENSG00000147596',
                  'ENSG00000114251',
                  'ENSG00000160963',
                  'ENSG00000144857',
                  'ENSG00000150893',
                  'ENSG00000172572',
                  'ENSG00000121753',
                  'ENSG00000155816',
                  'ENSG00000118777',
                ],
              },
              op: 'in',
            },
          ],
          op: 'and',
        },
      },
      message: 'Demo showing the heatmap and the clustering of 150 most variably expressed protein-coding genes from 150 cases of testicular cancer.',
      name: 'Demo Gene Expression',
      sets: {
        case: {
          'tcga-tgct--all-cases--test2': 'TCGA-TGCT',
        },
        gene: {
          'tcga-tgct--top-50-pc-genes--test2': 'Top 150 Most Variably-Expressed Genes',
        },
      },
      type: 'gene_expression',
    },
    description: 'Display the gene expression heatmap for sets of cases and genes of your choice.',
    Icon: withTheme(({ style }) => (
      <div>
        <GeneExpression
          style={{
            width: 80,
            height: 80,
            ...style,
          }}
          />
      </div>
    )),
    introText: (
      <React.Fragment>
        <p>
          Try out the beta release of our new tool for gene expression analysis.
          Display the gene expression heatmap for sets of cases and genes of your choice.
          Expression data is median-centred and clustered before visualization.
        </p>
        <p>
          <strong>COMING SOON:</strong>
          {' '}
          Filter genes by expression level, and select genes that are highly variable.
        </p>
        <p>
          Please send us your feedback at:
          {' '}
          <a href="mailto:support@nci-gdc.datacommons.io">support@nci-gdc.datacommons.io</a>
        </p>
      </React.Fragment>
    ),
    isBeta: true,
    label: 'Gene Expression',
    ResultComponent: props => (props.id.includes('demo-')
      ? (
        <Demo {...props}>
          <GeneExpressionContainer {...props} />
        </Demo>
      )
      : (
        <GeneExpressionContainer {...props} />
      )
    ),
    setInstructions: {
      gene: (
        <p>
          {'The '}

          <Link
            target="_blank"
            to="https://www.gsea-msigdb.org/gsea/msigdb/index.jsp"
            >
            Molecular Signatures Database (MSigDB)
          </Link>

          , a collection of annotated gene sets, can help you search for gene sets relevant to your analyses. MSigDB allows you to export these gene sets, which you can then upload to the GDC Portal for gene expression analysis.
        </p>
      ),
    },
    setTypes: ['case', 'gene'],
    type: 'gene_expression',
    validationInstructions: (
      <React.Fragment>
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
      </React.Fragment>
    ),
    validateSets: {
      availability: sets => (
          Object.keys(sets).length
            ? fetchApi(
              'gene_expression/availability',
              {
                body: {
                  case_set_id: Object.keys(sets.case)[0],
                  gene_set_id: Object.keys(sets.gene)[0],
                },
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            )
              .then(validateGeneExpressionAvailability)
              .catch(error => {
                console.error('Gene Expression Availability error', error);
              })
            : sets
      ),
      quantity: sets => sets &&
          ['case', 'gene'].every((t: any) => Object.keys(sets[t] || {}).length === 1),
    },
  },
  // Single Cell RNA Sequencing
  ...DISPLAY_SCRNA_SEQ && [
    // copied from clinical analysis and lightly modified
    // TODO: replace with real demoData, a real icon, etc
    {
      demoData: {
        filters: {
          'demo-pancreas': {
            content: [
              {
                content: {
                  field: 'cases.primary_site',
                  value: ['Pancreas'],
                },
                op: 'in',
              },
            ],
            op: 'and',
          },
        },
        message: 'Demo showing UMAP, t-SNE, PCA plots generated from single cell RNA sequencing data for a sample case.',
        name: 'Demo SCRNA-SEQ',
        sets: {
          case: {
            'demo-pancreas': 'Pancreas',
          },
        },
        type: 'scrna_seq',
      },
      description: 'Display a demo of different clustering visualizations for single cell RNA sequencing data.',
      Icon: withTheme(({ style }) => (
        <div>
          <SCRNASeq
            style={{
              width: 80,
              height: 80,
              ...style,
            }}
            />
        </div>
      )),
      label: 'Single Cell RNA Sequencing',
      ResultComponent: props => (
        <SCRNASeqContainer
          {...props}
          />
      ),
      setTypes: ['case'],
      type: 'scrna_seq',
      validateSets: sets => sets &&
        ['case'].every((t: any) => Object.keys(sets[t] || {}).length === 1),
    },
  ],
];

export default availableAnalysis;
