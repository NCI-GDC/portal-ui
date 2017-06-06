/* @flow */
/* globals fetch */
const fs = require("fs");
const path = require("path");
require("isomorphic-fetch");
const _ = require("lodash");

const getFacetType = require("@ncigdc/utils/getFacetType");

// ids and dates don't need aggregations
const getFacetAggregationTemplate = facet => {
  const fieldName = facet.name;
  const facetType = getFacetType(facet);
  if (_.includes(["datetime"], facetType)) {
    return "";
  }
  return `
${fieldName} @include(if: $shouldShow_${fieldName}) {
  ${{ terms: `
      buckets {
        doc_count
        key
      }
      `, id: `
      buckets {
        doc_count
        key
      }
      `, range: `
      count
      max
      avg
      min
    ` }[facetType]}
}`;
};

const exportTemplate = (facets, exportFunctionName, fragmentName) => `
export const initial${fragmentName}Variables = {
${facets.map(facet => `  shouldShow_${facet.name}: false`).join(",\n")}
};

export const ${exportFunctionName} = () => Relay.QL\`
  fragment on ${fragmentName} {
    ${facets.map(getFacetAggregationTemplate).join("\n")}
  }
\`;
`;

const wrapFile = contents => `/* @flow */
/* eslint max-len:0, comma-dangle:0 */

import Relay from 'react-relay/classic';
${contents}
`;

const generateFragments = async () => {
  const fetchAggregationFields = aggregationName => {
    const query = `
      query Queries {
      __type(name: "${aggregationName}"){
        name
        fields {
          name
          type {
            name
          }
        }
      }
    }`;
    return fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify({ query }),
    })
      .then(x => x.json())
      .then(x => x.data.__type.fields)
      .then(x => _.orderBy(x, ["name", "asc"]));
  };

  const [
    caseAggregationsFields,
    fileAggregationsFields,
    exploreCaseAggregationsFields,
  ] = [
    await fetchAggregationFields("CaseAggregations"),
    await fetchAggregationFields("FileAggregations"),
    await fetchAggregationFields("ECaseAggregations"),
  ];

  const repositoryCaseAggregations = exportTemplate(
    caseAggregationsFields,
    "repositoryCaseAggregationsFragment",
    "CaseAggregations",
  );
  const repositoryFileAggregations = exportTemplate(
    fileAggregationsFields,
    "repositoryFileAggregationsFragment",
    "FileAggregations",
  );
  const exploreCaseAggregations = exportTemplate(
    exploreCaseAggregationsFields,
    "exploreCaseAggregationsFragment",
    "ECaseAggregations",
  );

  fs.writeFileSync(
    path.join(__dirname, "repositoryCaseAggregations.js"),
    wrapFile(repositoryCaseAggregations),
  );
  fs.writeFileSync(
    path.join(__dirname, "repositoryFileAggregations.js"),
    wrapFile(repositoryFileAggregations),
  );
  fs.writeFileSync(
    path.join(__dirname, "exploreCaseAggregations.js"),
    wrapFile(exploreCaseAggregations),
  );
};

generateFragments()
  .then(() => console.log("done"))
  .catch(e => console.error(e));
