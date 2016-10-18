import OncoGrid from 'oncogrid';

import Consequence from './Consequence';

import dummyGenes from '../dummy-data/genes.json';
import dummyDonors from '../dummy-data/donors.json';
import dummyOccurences from '../dummy-data/occurrences.json';

function getString(str) {return str}
const fadeSteps = [0.05, 0.4, 0.7, 1];

// data mapping
function mapDonors(donors) {
  return donors.map(function (d) {
    return {
      'id': d.id,
      'age': (d.ageAtDiagnosis === undefined ? -777 : d.ageAtDiagnosis),
      'gender': (d.gender === undefined ? 'unknown' : d.gender),
      'vitalStatus': (d.vitalStatus === undefined ? false : (d.vitalStatus === 'alive' ? true : false)),
      'survivalTime': (d.survivalTime === undefined ? -777 : d.survivalTime),
      'pcawg': _.has(d, 'studies') && d.studies.indexOf('PCAWG') >= 0,
      'cnsmExists': d.cnsmExists,
      'stsmExists': d.stsmExists,
      'sgvExists': d.sgvExists,
      'methArrayExists': d.methArrayExists,
      'methSeqExists': d.methSeqExists,
      'expArrayExists': d.expArrayExists,
      'expSeqExists': d.expSeqExists,
      'pexpExists': d.pexpExists,
      'mirnaSeqExists': d.mirnaSeqExists,
      'jcnExists': d.jcnExists
    };
  });
}

function mapGenes(genes, curatedList) {
  return _.map(genes, function (g) {
    return {
      'id': g.id,
      'symbol': g.symbol,
      'totalDonors': g.affectedDonorCountTotal,
      'cgc': curatedList.indexOf(g.id) >= 0
    };
  });
}

function mapOccurences(occurrences, donors, genes) {
  var donorIds = _.map(donors, function (g) { return g.id; });
  var geneIds = _.map(genes, function (d) { return d.id; });

  var geneIdToSymbol = {};
  _(genes).forEach(function(g) {
    geneIdToSymbol[g.id] = g.symbol;
  }).value();

  function validOnco(o) {
    return geneIds.indexOf(o.geneId) >= 0 && donorIds.indexOf(o.donorId) >= 0 && o.functionalImpact === 'High';
  }

  function toOnco(o) {
    return {
      id: o.mutationId,
      donorId: o.donorId,
      geneId: o.geneId,
      geneSymbol: geneIdToSymbol[o.geneId],
      consequence: o.consequence.consequenceType,
      functionalImpact: o.consequence.functionalImpact
    };
  }

  return _(occurrences)
        .map(expandObs)
        .flatten()
        .map(toOnco)
        .filter(validOnco)
        .value();
}

function expandObs(o) {
  var expanded = [];
  var precedence = Consequence.precedence();

  _(o.genes).forEach(function (g) {
    var ret = _.clone(o);
    ret.geneId = g.geneId;

    var consequences = g.consequence.sort(function(t) {
      var index = precedence.indexOf(t.consequenceType);
      if (index === -1) {
        return precedence.length + 1;
      }
      return index;
    });

    ret.consequence = _(consequences).filter(function (d) { return d.functionalImpact === 'High'; } ).value()[0];
    if (ret.consequence === undefined) {
      ret.consequence = {functionalImpact: null, consequenceType: null};
    }

    expanded.push(ret);
  }).value();

  return expanded;
}

// sort functions
var sortInt = function (field) {
  return function (a, b) {
    return b[field] - a[field];
  };
};

var sortBool = function (field) {
  return function (a, b) {
    if (a[field] && !b[field]) {
      return -1;
    } else if (!a[field] && b[field]) {
      return 1;
    } else {
      return 0;
    }
  };
};

var sortByString = function (field) {
  return function (a, b) {
    if (a[field] > b[field]) {
      return 1;
    } else if (a[field] < b[field]) {
      return -1;
    } else {
      return 0;
    }
  };
};

// donor tracks
const clinicalDonorTracks = [
  {
    'name': 'Age at Diagnosis',
    'fieldName': 'age',
    'type': 'int',
    'sort': sortInt,
    'group': 'Clinical',
    'color': '#638f56',
  },
  {
    'name': 'Vital Status',
    'fieldName': 'vitalStatus',
    'type': 'vital',
    'sort': sortByString,
    'group': 'Clinical',
    'color': {
      'true': '#1693c0',
      'false': 'darkred'
    },
  },
  {
    'name': 'Survival Time',
    'fieldName': 'survivalTime',
    'type': 'survival',
    'sort': sortInt,
    'group': 'Clinical',
    'color': 'sienna',
  },
  {
    'name': 'Gender',
    'fieldName': 'gender',
    'type': 'gender',
    'sort': sortByString,
    'group': 'Clinical',
    'color': {
      'male': '#420692',
      'female': '#dc609c',
    }
  },
];

const dataTypeTracks = [
  {
    'name': 'CNSM',
    'fieldName': 'cnsmExists',
    'type': 'bool',
    'sort': sortBool,
    'group': 'Data Types',
    'color': 'mediumseagreen',
    'longName': 'Copy Number Somatic Mutations (CNSM)',
  },
  {
    'name': 'STSM',
    'fieldName': 'stsmExists',
    'type': 'bool',
    'sort': sortBool,
    'group': 'Data Types',
    'color': 'darkslategrey',
    'longName': 'Structural Somatic Mutations (StSM)',
  },
  {
    'name': 'SGV',
    'fieldName': 'sgvExists',
    'type': 'bool',
    'sort': sortBool,
    'group': 'Data Types',
    'color': 'darkkhaki',
    'longName': 'Simple Germline Variants (SGV)',
  },
  {
    'name': 'METH-A' ,
    'fieldName': 'methArrayExists',
    'type': 'bool',
    'sort': sortBool,
    'group': 'Data Types',
    'color': 'lightsalmon',
    'longName': 'Array-based DNA Methylation (METH-A)',
  },
  {
    'name': 'METH-S',
    'fieldName': 'methSeqExists',
    'type': 'bool',
    'sort': sortBool,
    'group': 'Data Types',
    'color': 'darksalmon',
    'longName': 'Sequence-based DNA Methylation (METH-S)',
  },
  {
    'name': 'EXP-A',
    'fieldName': 'expArrayExists',
    'type': 'bool',
    'sort': sortBool,
    'group': 'Data Types',
    'color': 'cyan',
    'longName': 'Array-based Gene Expression (EXP-A)',
  },
  {
    'name': 'EXP-S',
    'fieldName': 'expSeqExists',
    'type': 'bool',
    'sort': sortBool,
    'group': 'Data Types',
    'color': 'darkcyan',
    'longName': 'Sequence-based Gene Expression (EXP-S)',
  },
  {
    'name': 'PEXP',
    'fieldName': 'pexpExists',
    'type': 'bool',
    'sort': sortBool,
    'group': 'Data Types',
    'color': 'brown',
    'longName': 'Protein Expression (PEXP)',
  },
  {
    'name': 'miRNA-S',
    'fieldName': 'mirnaSeqExists',
    'type': 'bool',
    'sort': sortBool,
    'group': 'Data Types',
    'color': 'purple',
    'longName': 'Sequence-based miRNA Expression (miRNA)',
  },
  {
    'name': 'JCN',
    'fieldName': 'jcnExists',
    'type': 'bool',
    'sort': sortBool,
    'group': 'Data Types',
    'color': 'slategray',
    'longName': 'Exon Junctions (JCN)',
  },
];

var donorTracks = [
  ...clinicalDonorTracks,
  ...dataTypeTracks,
];

function clinicalLegend(maxSurvival) {
  return '<b>Clinical Data:</b><br>' +

    '<b>vitalStatus:</b> ' +
    'Deceased: ' + getSquare({fieldName: 'vitalStatus', value: false}) + ' ' +
    'Alive: ' + getSquare({fieldName: 'vitalStatus', value: true}) + '<br>' +

    '<b>age (years): </b> 0 ' +
    fadeSteps.reduce((html, opacity) => html + getSquare({fieldName: 'age', opacity: opacity}), '') +
    ' 100+ <br>' +

    '<b>survivalTime (days):</b> 0 ' +
    fadeSteps.reduce((html, opacity) => html + getSquare({fieldName: 'survivalTime', opacity: opacity}), '') +
    maxSurvival +

    '<b>gender:</b> ' +
    'Male: ' + getSquare({fieldName: 'gender', value: 'male'}) +
    ' Female: ' + getSquare({fieldName: 'gender', value: 'female'}) + '<br>';
};

function dataTypeLegend() {
  return dataTypeTracks.reduce((html, track) => (
    html + getSquare({fieldName: track.fieldName}) + track.longName + ' <br>'
  ), '<b>Available Data Types:</b><br>');
};

// gene tracks
const geneTracks = [
  {
    'name': '# Cases affected ',
    'fieldName': 'totalDonors',
    'type': 'int',
    'sort': sortInt,
    'group': 'GDC',
    'color': 'mediumpurple',
  },
  {
    'name': 'Curated Gene Census ',
    'fieldName': 'cgc',
    'type': 'bool',
    'sort': sortBool,
    'group': 'Gene Sets',
    'color': 'darkgreen',
  }
];

function gdcLegend(max) {
  return fadeSteps.reduce(
    (html, opacity) => html + getSquare({fieldName: 'totalDonors', opacity: opacity}),
    '<b># of Cases Affected:</b><br>'
  ) + max;
};

function geneSetLegend() {
  return '<b> Gene Sets: </b> <br>' + 
    getSquare({fieldName: 'cgc'}) +
    ' Gene belongs to Cancer Gene Census';
};

// rollover templates
const mainGridRollover = `
  {{#observation}}
    {{observation.id}}<br>
    {{observation.geneSymbol}}<br>
    {{observation.donorId}}<br>
    {{observation.consequence}}<br>
  {{/observation}}
`;

const trackColorMap = [...donorTracks, ...geneTracks].reduce((map, t) => ({...map, [t.fieldName]: t.color}), {});

const fillFunc = (track) => {
  const color = trackColorMap[track.fieldName] || '';
  return typeof color === 'string' ? color : color[track.value];
};

function getSquare(field) {
  const opacityStyle = typeof field.opacity === 'number' ? '; opacity: ' + field.opacity : '';
  return '<div class="onco-track-legend" style="background: ' + fillFunc(field) + opacityStyle + '"></div>';
};

export default {
  hasNoData: true,

  init: function ({
    donorData = dummyDonors.hits,
    geneData = dummyGenes.hits,
    occurencesData = dummyOccurences.hits,
    colorMap,
    element,
    clickHandlers = {},
    height = 150,
    width = 680,
    curatedList = [],
  }) {
    let donors = mapDonors(donorData);
    let genes = mapGenes(geneData, curatedList);
    const observations = mapOccurences(occurencesData, donors, genes);

    this.hasNoData = observations.length === 0;
    if (this.hasNoData) {
      return;
    }

    // Clean gene & donor data before using for oncogrid. 
    const donorObs = _.map(observations, 'donorId');
    const geneObs = _.map(observations, 'geneId');
    donors = _.filter(donors, function(d) { return donorObs.indexOf(d.id) >= 0;});
    genes = _.filter(genes, function(g) { return geneObs.indexOf(g.id) >= 0;});

    const maxSurvival = _.max(_.map(donors, function(d) { return d.survivalTime; } ));
    const maxDonorsAffected = _.max(genes, function (g) { return g.totalDonors; }).totalDonors;

    const donorOpacityFunc = function (d) {
      if (d.type === 'int') {
        return d.value / 100;
      } else if (d.type === 'vital') {
        return 1;
      } else if (d.type === 'gender') {
        return 1;
      } else if (d.type === 'bool') {
        return d.value ? 1 : 0;
      } else if (d.type === 'survival') {
        return d.value / maxSurvival;
      } else {
        return 0;
      }
    };

    const geneOpacity = function (g) {
      if (g.type === 'int') {
        return g.value / maxDonorsAffected;
      } else if (g.type === 'bool') {
        return g.value ? 1 : 0;
      } else {
        return 1;
      }
    };

    this._gridParams = {
      donors: donors,
      genes: genes,
      observations: observations,
      height: height,
      width: width,
      element: element,
      colorMap: colorMap,

      heatMap: false,
      grid: true,
      minCellHeight: 8,
      trackHeight: 12,
      trackLegends: {
        'GDC': gdcLegend(maxDonorsAffected),
        'Gene Sets': geneSetLegend(),

        'Clinical': clinicalLegend(maxSurvival),
        'Data Types': dataTypeLegend(),
      },
      templates: {
        mainGridCrosshair: mainGridRollover,
        mainGrid: mainGridRollover,
      },

      donorTracks: donorTracks,
      donorOpacityFunc: donorOpacityFunc,
      donorFillFunc: fillFunc,

      geneTracks: geneTracks,
      geneOpacityFunc: geneOpacity,
      geneFillFunc: fillFunc,

      margin: { top: 30, right: 50, bottom: 200, left: 80 },

      ...clickHandlers,
    };

    this._initGrid();
  },

  _initGrid: function() {
    if(this._grid) {
      this._grid.destroy();
    }

    this._grid = new OncoGrid(_.cloneDeep(this._gridParams));
    this._grid.render();
  },

  reload: function() {
    this._initGrid();

    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) {
      setTimeout(() => {
        this._grid.resize(screen.width - 400, screen.height - 400, true);
      }, 0);
    }
  },

  resize: function(w, h) {
    this._grid.resize(w, h);
  },

  cluster: function() {
    this._grid.cluster();
  },

  toggleHeatmap: function() {
    this._grid.toggleHeatmap();
  },

  toggleGridLines: function() {
    this._grid.toggleGridLines();
  },

  toggleCrosshair: function() {
    this._grid.toggleCrosshair();
  },

  get crosshairMode() {
    return this._grid.crosshairMode;
  },

  get heatMapMode() {
    return this._grid.heatMapMode;
  },

  get gridActive() {
    return this._grid.drawGridLines;
  },
}
