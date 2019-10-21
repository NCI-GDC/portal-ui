// @flow
import _ from 'lodash';

type TCapitalize = (original: string) => string;
type THumanify = ({ }: IHumanifyParams) => string;
type TTruncateAfterMarker = (
  term: string,
  markers: [string],
  length: number,
  omission?: string
) => string;
type TIsUuid = (query: string) => boolean;
type TCreateFacetFieldString = (fieldName: string) => string;

interface IHumanifyParams {
  term: string;
  capitalize?: boolean;
  facetTerm?: boolean;
}

export const capitalize: TCapitalize = original => {
  const customCapitalizations = {
    mirna: 'miRNA',
    dbsnp: 'dbSNP',
    cosmic: 'COSMIC',
  };
  return original
    .split(' ')
    .map(
      word =>
        customCapitalizations[word.toLowerCase()] ||
        `${word.charAt(0).toUpperCase()}${word.slice(1)}`
    )
    .join(' ');
};

export const humanify: THumanify = ({
  term,
  capitalize: cap = true,
  facetTerm = false,
}) => {
  let original;
  let humanified;
  if (facetTerm) {
    // Splits on capital letters followed by lowercase letters to find
    // words squished together in a string.
    original = term.split(/(?=[A-Z][a-z])/).join(' ');
    humanified = term
      .replace(/\./g, ' ')
      .replace(/_/g, ' ')
      .trim();
  } else {
    const split = (original || term).split('.');
    humanified = split[split.length - 1].replace(/_/g, ' ').trim();

    // Special case 'name' to include any parent nested for sake of
    // specificity in the UI
    if (humanified === 'name' && split.length > 1) {
      humanified = `${split[split.length - 2]} ${humanified}`;
    }
  }

  return cap ? capitalize(humanified) : humanified;
};

export const truncateAfterMarker: TTruncateAfterMarker = (
  term,
  markers,
  length,
  omission = '…'
) => {
  const markersByIndex = markers.reduce(
    (acc, marker) => {
      const index = term.indexOf(marker);
      if (index !== -1) {
        return { index, marker };
      }
      return acc;
    },
    { index: -1, marker: '' }
  );
  const { index, marker } = markersByIndex;
  if (index !== -1 && term.length > index + marker.length + 8) {
    return `${term.substring(0, index + marker.length + 8)}${omission}`;
  }
  return term;
};

export const isUUID: TIsUuid = query =>
  /^[a-zA-Z0-9]{8}\-[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{12}$/.test(
    _.trim(query)
  );

export const createFacetFieldString: TCreateFacetFieldString = fieldName =>
  fieldName.replace(/\./g, '__');