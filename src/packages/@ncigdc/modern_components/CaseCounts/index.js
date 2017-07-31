import CaseCountsDataCategoryComponent from './CaseCountsDataCategory';
import CaseCountsExpStrategyComponent from './CaseCountsExpStrategy';
import createRenderer from './CaseCounts.relay';

const CaseCountsDataCategory = createRenderer(CaseCountsDataCategoryComponent);
const CaseCountsExpStrategy = createRenderer(CaseCountsExpStrategyComponent);

export { CaseCountsDataCategory, CaseCountsExpStrategy };
