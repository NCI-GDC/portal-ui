import OncoGrid from 'oncogrid';

import Consequence from './Consequence';

import dummyGenes from '../dummy-data/genes.json';
import dummyDonors from '../dummy-data/donors.json';
import dummyOccurences from '../dummy-data/occurrences.json';


const gettextCatalog = {
  getString: function(str) {return str}
}

function mapDonors(donors) {
  return donors.map(function (d) {
    return {
      'id': d.id,
      'age': (d.ageAtDiagnosis === undefined ? -777 : d.ageAtDiagnosis),
      'sex': (d.gender === undefined ? 'unknown' : d.gender),
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
};

function mapGenes(genes, curatedList) {
  return _.map(genes, function (g) {
    return {
      'id': g.id,
      'symbol': g.symbol,
      'totalDonors': g.affectedDonorCountTotal,
      'cgc': curatedList.indexOf(g.id) >= 0
    };
  });
};

function mapOccurences(occurrences, donors, genes) {
  var donorIds = _.map(function (g) { return g.id; });
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
        // .filter(validOnco)
        .value();
};

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


// tooptips
function icgcLegend(max) {
  var value = '<b># of Donors Affected:</b> </br>' + 
          '0 <div class="onco-track-legend onco-total-donor-legend" style="opacity:0.1"></div>' + 
          '<div class="onco-track-legend onco-total-donor-legend" style="opacity:0.4"></div>' + 
          '<div class="onco-track-legend onco-total-donor-legend" style="opacity:0.7"></div>' +
          '<div class="onco-track-legend onco-total-donor-legend" style="opacity:1"></div>' +
          max;

  return value;
};

function geneSetLegend() {
  var value = '<b> Gene Sets: </b> <br>' + 
          '<div class="onco-track-legend onco-cgc-legend"></div> '+
          'Gene belongs to Cancer Gene Census';

  return value;
};


function dataTypeLegend() {
  var value = '<b>' + gettextCatalog.getString('Available Data Types') + ':</b><br>' +
    '<div class="onco-track-legend onco-cnsm-legend"></div> ' +
      gettextCatalog.getString('Copy Number Somatic Mutations (CNSM)') + ' <br>' +
    '<div class="onco-track-legend onco-stsm-legend"></div> ' +
      gettextCatalog.getString('Structural Somatic Mutations (StSM)') + ' <br>' +
    '<div class="onco-track-legend onco-sgv-legend"></div> ' +
      gettextCatalog.getString('Simple Germline Variants (SGV)') + ' <br>' +
    '<div class="onco-track-legend onco-metha-legend"></div> ' +
      gettextCatalog.getString('Array-based DNA Methylation (METH-A)') + ' <br>' +
    '<div class="onco-track-legend onco-meths-legend"></div> ' +
      gettextCatalog.getString('Sequence-based DNA Methylation (METH-S)') + ' <br>' +
    '<div class="onco-track-legend onco-expa-legend"></div> ' +
      gettextCatalog.getString('Array-based Gene Expression (EXP-A)') + ' <br>' +
    '<div class="onco-track-legend onco-exps-legend"></div> ' +
      gettextCatalog.getString('Sequence-based Gene Expression (EXP-S)') + ' <br>' +
    '<div class="onco-track-legend onco-pexp-legend"></div> ' +
      gettextCatalog.getString('Protein Expression (PEXP)') + ' <br>' +
    '<div class="onco-track-legend onco-mirna-legend"></div> ' +
      gettextCatalog.getString('Sequence-based miRNA Expression (miRNA)') + ' <br>' +
    '<div class="onco-track-legend onco-jcn-legend"></div> ' +
      gettextCatalog.getString('Exon Junctions (JCN)') + ' <br>';
              
  return value;
};

function studyLegend() {
  var value = '<b>Studies:</b> <br>' + 
    '<div class="onco-track-legend onco-pcawg-legend" style="opacity:1"></div>' +
    gettextCatalog.getString('Donor in PCAWG Study');

  return value;
};


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





export default {
  hasNoData: true,
  init: function () {
    // TODO: use real data
    var donors = mapDonors(dummyDonors.hits);
    var genes = mapGenes(dummyGenes.hits, []);
    var observations = mapOccurences(dummyOccurences.hits, donors, genes);

    // Clean gene & donor data before using for oncogrid. 
    var donorObs = _.map(observations, 'donorId');
    var geneObs = _.map(observations, 'geneId');
    donors = _.filter(donors, function(d) { return donorObs.indexOf(d.id) >= 0;});
    genes = _.filter(genes, function(g) { return geneObs.indexOf(g.id) >= 0;});
    
    // observations = [];
    
    this.hasNoData = observations.length === 0;
    if (this.hasNoData) {
      return;
    }

    var donorTracks = [
      { 
        'name': 'Age at Diagnosis',
        'fieldName': 'age',
        'type': 'int',
        'sort': sortInt,
        'group': 'Clinical'
      },
      {
        'name': 'Vital Status',
        'fieldName': 'vitalStatus',
        'type': 'vital', 'sort': sortByString, 'group': 'Clinical' },
      { 'name': 'Survival Time',
        'fieldName': 'survivalTime', 'type': 'survival', 'sort': sortInt, 'group': 'Clinical'},
      { 'name': 'Sex', 'fieldName': 'sex', 'type': 'sex', 'sort': sortByString, 'group': 'Clinical'},
      { 'name': 'CNSM', 'fieldName': 'cnsmExists', 'type': 'bool', 'sort': sortBool, 'group': 'Data Types' },
      { 'name': 'STSM', 'fieldName': 'stsmExists', 'type': 'bool', 'sort': sortBool, 'group': 'Data Types' },
      { 'name': 'SGV', 'fieldName': 'sgvExists', 'type': 'bool', 'sort': sortBool, 'group': 'Data Types' },
      { 'name': 'METH-A' , 
        'fieldName': 'methArrayExists', 'type': 'bool', 'sort': sortBool, 'group': 'Data Types' },
      { 'name': 'METH-S', 
        'fieldName': 'methSeqExists', 'type': 'bool', 'sort': sortBool, 'group': 'Data Types' },
      { 'name': 'EXP-A', 
        'fieldName': 'expArrayExists', 'type': 'bool', 'sort': sortBool, 'group': 'Data Types' },
      { 'name': 'EXP-S', 
        'fieldName': 'expSeqExists', 'type': 'bool', 'sort': sortBool, 'group': 'Data Types' },
      { 'name': 'PEXP', 'fieldName': 'pexpExists', 'type': 'bool', 'sort': sortBool, 'group': 'Data Types' },
      { 'name': 'miRNA-S', 
        'fieldName': 'mirnaSeqExists', 'type': 'bool', 'sort': sortBool, 'group': 'Data Types' },
      { 'name': 'JCN', 'fieldName': 'jcnExists', 'type': 'bool', 'sort': sortBool, 'group': 'Data Types' },
      { 'name': 'PCAWG', 'fieldName': 'pcawg', 'type': 'bool', 'sort': sortBool, 'group': 'Study' }
    ];

    var maxSurvival = _.max(_.map(donors, function(d) { return d.survivalTime; } ));

    function clinicalLegend(maxSurvival) {
      var value =  '<b>' + gettextCatalog.getString('Clinical Data') + ':</b> <br>' +
      '<b>' + gettextCatalog.getString('Age at Diagnosis (years)') + ': </b> ' + 
        '0 <div class="onco-track-legend onco-age-legend" style="opacity:0.05"></div>' +
        '<div class="onco-track-legend onco-age-legend" style="opacity:0.4"></div>' + 
        '<div class="onco-track-legend onco-age-legend" style="opacity:0.7"></div>' + 
        '<div class="onco-track-legend onco-age-legend" style="opacity:1"></div> 100+ <br>' + 
      '<b>' + gettextCatalog.getString('Vital Status') + ':</b> ' +
        gettextCatalog.getString('Deceased') + ': <div class="onco-track-legend onco-deceased-legend"></div> ' + 
        gettextCatalog.getString('Alive') + ': <div class="onco-track-legend onco-alive-legend"></div><br>' + 
      '<b>' + gettextCatalog.getString('Survival Time (days)') + ':</b> ' +
        '0 <div class="onco-track-legend onco-survival-legend" style="opacity:0.05"></div>' +
        '<div class="onco-track-legend onco-survival-legend" style="opacity:0.4"></div>' + 
        '<div class="onco-track-legend onco-survival-legend" style="opacity:0.7"></div>' + 
        '<div class="onco-track-legend onco-survival-legend" style="opacity:1"></div>' + 
        maxSurvival + '<br>' + 
      '<b>' + gettextCatalog.getString('Sex') + ':</b> ' + gettextCatalog.getString('Male') + 
      ' <div class="onco-track-legend onco-male-legend"></div> ' + 
        gettextCatalog.getString('Female') + ' <div class="onco-track-legend onco-female-legend"></div><br>';

      return value;
    };

    var donorOpacity = function (d) {
      if (d.type === 'int') {
        return d.value / 100;
      } else if (d.type === 'vital') {
        return 1;
      } else if (d.type === 'sex') {
        return 1;
      } else if (d.type === 'bool') {
        return d.value ? 1 : 0;
      } else if (d.type === 'survival') {
        return d.value / maxSurvival;
      } else {
        return 0;
      }
    };

    var geneTracks = [
      {
        'name': '# Donors affected ',
        'fieldName': 'totalDonors',
        'type': 'int',
        'sort': sortInt,
        'group': 'ICGC'
      },
      {
        'name': 'Curated Gene Census ',
        'fieldName': 'cgc',
        'type': 'bool',
        'sort': sortBool,
        'group': 'Gene Sets'
      }
    ];
    var trackLegends = {
      'ICGC': icgcLegend(maxDonorsAffected),
      'Gene Sets': geneSetLegend(),
      'Clinical': clinicalLegend(maxSurvival),
      'Data Types': dataTypeLegend(),
      'Study': studyLegend()
    };

    var maxDonorsAffected = _.max(genes, function (g) { return g.totalDonors; }).totalDonors;

    var geneOpacity = function (g) {
      if (g.type === 'int') {
        return g.value / maxDonorsAffected;
      } else if (g.type === 'bool') {
        return g.value ? 1 : 0;
      } else {
        return 1;
      }
    };

    var gridClick = function (o) {
      window.location = obsSearch +
        '{"mutation":{"id": {"is":["' + o.id + '"]}}}';
    };

    var donorClick = function (d) {
      window.location = /donors/ + d.id +
        '?filters={"mutation":{"functionalImpact":{"is":["High"]}}}';
    };

    var donorHistogramClick = function (d) {
      window.location = donorSearch +
        '{"donor":{"id":{"is": ["' + d.id + '"]}}, "mutation":{"functionalImpact":{"is":["High"]}},' + 
          '"gene":{"id":{"is":["ES:' + $scope.geneSet + '"]}}}';
    };

    var geneClick = function (g) {
      window.location = /genes/ + g.id +
        '?filters={"mutation":{"functionalImpact":{"is":["High"]}}}';
    };

    var geneHistogramClick = function (g) {
      window.location = geneSearch +
        '{"gene":{"id":{"is": ["' + g.id + '"]}}, "mutation":{"functionalImpact":{"is":["High"]}},'+ 
          '"donor":{"id":{"is":["ES:' + $scope.donorSet + '"]}}}';
    };

    var colorMap = {
      'missense_variant': '#ff9b6c',
      'frameshift_variant': '#57dba4',
      'stop_gained': '#af57db',
      'start_lost': '#ff2323',
      'stop_lost': '#d3ec00',
      'initiator_codon_variant': '#5abaff'
    };

    var params = {
      donors: donors,
      genes: genes,
      observations: observations,
      element: '#oncogrid-div',
      height: 150,
      width: 680,
      colorMap: colorMap,
      gridClick: gridClick,
      heatMap: false,
      grid: true,
      minCellHeight: 8,
      trackHeight: 12,
      trackLegends: trackLegends,
      donorTracks: donorTracks,
      donorOpacityFunc: donorOpacity,
      donorClick: donorClick,
      donorHistogramClick: donorHistogramClick,
      geneTracks: geneTracks,
      geneOpacityFunc: geneOpacity,
      geneClick: geneClick,
      geneHistogramClick: geneHistogramClick,
      margin: { top: 30, right: 50, bottom: 200, left: 80 },
    };
    
    window.gridController = this;

    this.gridActive = true;
    this.crosshairMode = false;
    this.heatMapMode = false;
    this._grid = new OncoGrid(params);
    this._grid.render();
  },

  reload: function() {
    this._grid.destroy();
    // cleanActives();
    this.init();

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
    this.heatMapMode = !this.heatMapMode;
    this._grid.toggleHeatmap();
  },
  toggleGridLines: function() {
    this.gridActive = !this.gridActive;
    this._grid.toggleGridLines();
  },
  toggleCrosshair: function() {
    this.crosshairMode = !this.crosshairMode;
    this._grid.toggleCrosshair();
  }
}
