import {
  MISLABELEDHEADERS,
  PLOTLYCONFIGS,
} from './constants';

const {
  clusteringMethods,
  rowBaseTemplate,
} = PLOTLYCONFIGS;

export const clusteringDataTemplate = clusteringMethods.reduce(
  (acc, methodName) => ({
    ...acc,
    [methodName.toLowerCase().replace('-', '')]: {
      data: [],
      name: methodName,
    },
  }), {},
);

const headerNormaliser = originalHeader => MISLABELEDHEADERS[originalHeader] || originalHeader;

export const shapeClusteringData = (parsedChunk, existingData) => (
  parsedChunk.reduce((newState, parsedRow) => (
    Object.keys(newState).reduce(
      (acc, simplifiedMethodName) => {
        const is3D = /3d/g.test(simplifiedMethodName);
        const {
          data,
          ...previous
        } = acc[simplifiedMethodName];
        const cluster = parsedRow.seurat_cluster;
        const currentCluster = data[cluster] || rowBaseTemplate(is3D);


        return ({
          ...acc,
          [simplifiedMethodName]: {
            ...previous,
            data: Object.values({
              ...data,
              [cluster]: {
                ...currentCluster,
                name: `${Number(cluster)} - ${(currentCluster.x || []).length} cells`,
                x: (currentCluster.x || [])
                  .concat(parsedRow[`${headerNormaliser(simplifiedMethodName)}_1`]),
                y: (currentCluster.y || [])
                  .concat(parsedRow[`${headerNormaliser(simplifiedMethodName)}_2`]),
                ...is3D
                  ? {
                    z: (currentCluster.z || [])
                      .concat(parsedRow[`${headerNormaliser(simplifiedMethodName)}_3`]),
                  }
                  : {},
              },
            }),
          },
        });
      },
      newState,
    )
  ), existingData)
);
