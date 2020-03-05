const stickyHeaderStyle = {
  thStyle: {
    position: 'sticky',
    top: 0,
  },
};

export const userAccessListStub = ['fm'];

export const getHeadings = ({ isAuth, userAccessList }) => ([
  ...isAuth &&
    userAccessList.length > 0 &&
    [
      {
        key: 'select',
        title: 'Select',
      },
    ],
  {
    key: 'program',
    title: 'Program',
  },
  {
    key: 'cases_clinical',
    title: 'Cases & Clinical',
  },
  {
    key: 'genes_mutations',
    title: 'Genes & Mutations',
  },
]).map(heading => ({
  ...heading,
  ...stickyHeaderStyle,
}));

export const dataStub = [
  {
    genes_mutations: 'controlled',
    program: 'genie',
  },
  {
    genes_mutations: 'controlled',
    program: 'fm',
  },
  {
    genes_mutations: 'open',
    program: 'tcga',
  },
  {
    program: 'target',
  },
  {
    program: 'mmrf',
  },
  {
    program: 'cptac',
  },
  {
    program: 'beataml 1.0',
  },
  {
    program: 'nciccr',
  },
  {
    program: 'ohu',
  },
  {
    program: 'cgci',
  },
  {
    program: 'wcdt',
  },
  {
    program: 'organoid',
  },
  {
    program: 'ctsp',
  },
  {
    program: 'hcmi',
  },
  {
    program: 'varpop',
  },
]
  .map(stub => ({
    ...stub,
    cases_clinical: 'open',
    genes_mutations: stub.genes_mutations || 'not_available',
  }));
