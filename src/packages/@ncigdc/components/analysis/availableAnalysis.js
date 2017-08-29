type TSelectedSets = {
  [string]: Array<string>,
};

type TAnalysis = {|
  type: string,
  title: string,
  Icon: ReactComponent<*>,
  description: string,
  demoData: {|
    id: string,
    sets: TSelectedSets,
    type: string,
    created: string,
  |},
  setInstructions: string,
  setDisabledMessage: ({ sets: TSelectedSets, type: string }) => ?string,
  validateSets: TSelectedSets => boolean,
  ResultComponent: ReactComponent<*>,
|};

const availableAnalysis: Array<TAnalysis> = [
  {
    type: 'set_operations',
    title: 'Set Operations',
    Icon: p =>
      <span style={{ marginRight: 25, marginLeft: -10 }}>
        <Venn {...p} data={[1, 2, 3]} width={65} height={70} radius={18} />
      </span>,
    description:
      'Display Venn diagram and find intersection or union, etc. of your sets of the same type.',
    demoData: {
      // id: 'demo-oncogrid',
      // sets: { case: ['AV4LfE0RtAqwfvhAJ7wC'], gene: ['AV4LNdQwLqCe7fg6V8DU'] }, // TODO: setIds will change, need way to generate or store these.
      // type: 'oncogrid',
      // created: new Date().toISOString(),
    },
    setInstructions: 'Select 2 or 3 of the same set type',
    setDisabledMessage: ({ sets, type }) =>
      !['case', 'gene'].includes(type)
        ? "This analysis can't be run with this type"
        : (sets[type] || []).length
          ? `You can only select one ${type} set`
          : null,
    validateSets: sets => {
      const entries = Object.entries(sets);
      console.log(entries);
      return true;
    },
    // return setO.every(([k, v]), i) => s.type === sets[i].type),
    ResultComponent: ({ sets }) => {
      return (
        <div>
          do stuff here
        </div>
      );
    },
  },
];

export default availableAnalysis;
