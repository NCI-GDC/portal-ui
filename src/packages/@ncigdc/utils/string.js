// @flow

export const capitalize = (original: string) => {
  const customCapitalizations = {
    mirna: "miRNA",
    dbsnp: "dbSNP",
    cosmic: "COSMIC"
  };
  return original
    .split(" ")
    .map(
      word =>
        customCapitalizations[word.toLowerCase()] ||
        `${word.charAt(0).toUpperCase()}${word.slice(1)}`
    )
    .join(" ");
};

export const humanify = ({
  term,
  capitalize: cap = true,
  facetTerm = false
}) => {
  let original;
  let humanified;
  if (facetTerm) {
    // Splits on capital letters followed by lowercase letters to find
    // words squished together in a string.
    original = term.split(/(?=[A-Z][a-z])/).join(" ");
    humanified = term.replace(/\./g, " ").replace(/_/g, " ").trim();
  } else {
    const split = (original || term).split(".");
    humanified = split[split.length - 1].replace(/_/g, " ").trim();

    // Special case 'name' to include any parent nested for sake of
    // specificity in the UI
    if (humanified === "name" && split.length > 1) {
      humanified = `${split[split.length - 2]} ${humanified}`;
    }
  }

  return cap ? capitalize(humanified) : humanified;
};
