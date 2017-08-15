import Count from './Count';
import exploreCase from './exploreCase.relay';
import repositoryCase from './repositoryCase.relay';
import exploreGene from './exploreGene.relay';

export const ExploreCaseCount = exploreCase(Count);
export const RepositoryCaseCount = repositoryCase(Count);
export const GeneCount = exploreGene(Count);
