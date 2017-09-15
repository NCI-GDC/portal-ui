import Count from './Count';
import exploreCase from './exploreCase.relay';
import repositoryCase from './repositoryCase.relay';
import exploreGene from './exploreGene.relay';
import exploreSsm from './exploreSsm.relay';

export const ExploreCaseCount = exploreCase(Count);
export const RepositoryCaseCount = repositoryCase(Count);
export const GeneCount = exploreGene(Count);
export const SsmCount = exploreSsm(Count);

export default {
  case: ExploreCaseCount,
  gene: GeneCount,
  ssm: SsmCount,
};
