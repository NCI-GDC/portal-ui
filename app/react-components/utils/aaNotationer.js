const aaMap = {
  'CYS': 'C',
  'ASP': 'D',
  'SER': 'S',
  'GLN': 'Q',
  'LYS': 'K',
  'ILE': 'I',
  'PRO': 'P',
  'THR': 'T',
  'PHE': 'F',
  'ASN': 'N',
  'GLY': 'G',
  'HIS': 'H',
  'LEU': 'L',
  'ARG': 'R',
  'TRP': 'W',
  'ALA': 'A',
  'VAL': 'V',
  'GLU': 'E',
  'TYR': 'Y',
  'MET': 'M',
  'TER': '*',
};

export const toSingle = (tripleNotation) => {
  const noP = tripleNotation.replace(/^p\./, '');
  const re = new RegExp(Object.keys(aaMap).join('|'), 'ig');
  const matches = noP.match(re);
  return matches.reduce((acc, m) => acc.replace(m, aaMap[m.toUpperCase()]), noP);
};
