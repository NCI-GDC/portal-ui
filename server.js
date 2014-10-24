// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');     // call express
var _ = require('lodash');    // call lodash
var app = express();        // define our app using express
var bodyParser = require('body-parser');
var uuid = require('node-uuid');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3001;    // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();        // get an instance of the express Router

router.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});


// test route to make sure everything is working (accessed at GET http://localhost:3001/api)
router.get('/', function (req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here
// Widgets
var widgets = {
  pagination: {"count": 20, "total": 50, "size": 0, "from": 1, "page": 1, "pages": 50, "sort": "totalDonorCount", "order": "desc"},
  facets: [],
  hits: [
    {id: 'PR1', name: 'Widget One'},
    {id: 'PR2', name: 'Widget Two'},
    {id: 'PR3', name: 'Widget Three'},
    {id: 'PR4', name: 'Widget Four'},
    {id: 'PR5', name: 'Widget Five'}
  ]};
router.get('/widgets', function (req, res) {
  res.json(widgets);
});
router.get('/widgets/:id', function (req, res) {
  res.json(_.find(widgets.hits, function (obj) {
    return obj.id === req.params.id;
  }));
});
// Projects
var projects = {
  pagination: {"count": 20, "total": 50, "size": 0, "from": 1, "page": 1, "pages": 50, "sort": "totalDonorCount", "order": "desc"},
  facets: [],
  hits: [
    {id: 'PR1', name: 'Project One'},
    {id: 'PR2', name: 'Project Two'},
    {id: 'PR3', name: 'Project Three'},
    {id: 'PR4', name: 'Project Four'},
    {id: 'PR5', name: 'Project Five'}
  ]};
projects.hits.forEach(function(project) {
  project.code = "GBM-TCGA";
  project.name = "Brain Glioblastoma Multiforme";
  project.site = "Brain";
  project.numDonors = Math.round(Math.random() * 100);
  project.program = "TCGA";
  project.sequencingCenter = "BI";
  project.numFiles = Math.round(Math.random() * 100);
  project.data = {
    "Clincal" : Math.round(Math.random() *100),
    "Mutation": Math.round(Math.random() *100),
    "mRNA": Math.round(Math.random() *100),
    "miRNA": Math.round(Math.random() *100),
    "Copy Number": Math.round(Math.random() *100),
    "Meth": Math.round(Math.random() *100),
    "Protein Expr": null
  };
  project.status = Math.round(Math.random()) ? "Legacy" : "Active";
  project.date = new Date();
  project.experiments = [
      {
        name: "RNA-Seq",
        participants: Math.round(Math.random() * 100),
        samples: Math.round(Math.random() * 400),
        files: Math.round(Math.random() * 700)
      },
      {
        name: "WGS",
        participants: Math.round(Math.random() * 100),
        samples: Math.round(Math.random() * 400),
        files: Math.round(Math.random() * 700)
      },
      {
        name: "WXS",
        participants: Math.round(Math.random() * 100),
        samples: Math.round(Math.random() * 400),
        files: Math.round(Math.random() * 700)
      },
      {
        name: "miRNA-Seq",
        participants: Math.round(Math.random() * 100),
        samples: Math.round(Math.random() * 400),
        files: Math.round(Math.random() * 700)
      },
      {
        name: "Bisulfite-Seq",
        participants: Math.round(Math.random() * 100),
        samples: Math.round(Math.random() * 400),
        files: Math.round(Math.random() * 700)
      },
      {
        name: "Genotype Array",
        participants: Math.round(Math.random() * 100),
        samples: Math.round(Math.random() * 400),
        files: Math.round(Math.random() * 700)
      }
    ];
    project.reports = [
      {
        id: 93883,
        type: "Case Overview",
        date: new Date()
      },
      {
        id: 38373,
        type: "BCR Pipeline",
        date: new Date()
      }
    ];
});
router.get('/projects', function (req, res) {
  res.json(projects);
});
router.get('/projects/:id', function (req, res) {
  res.json(_.find(projects.hits, function (obj) {
    return obj.id === req.params.id;
  }));
});

// Annotations
var annotations = {
  pagination: {"count": 20, "total": 50, "size": 0, "from": 1, "page": 1, "pages": 50, "sort": "totalDonorCount", "order": "desc"},
  facets: [],
  hits: []
};

router.get('/annotations', function (req, res) {
  res.json(annotations);
});
router.get('/annotations/:id', function (req, res) {
  res.json(_.find(annotations.hits, function (obj) {
    return obj.id === req.params.id;
  }));
});

function createAnnotations(count) {
  var newAnnotations = [];

  for (var i = 0; i < count; i++) {
    var annotation = {};

    annotation.notes = [];

    var noteCount = Math.max(1, Math.round(Math.random() * 3));
    for (var m = 0; m < noteCount; m++) {
      annotation.notes.push({
        dateAdded: new Date(),
        dateEdited: new Date(),
        addedBy: "DCC",
        editedBy: "Jill",
        id: uuid.v4(),
        text: "It provides a way to enter annotations for specific items. User can also browse/query the annotations." +
              "It's also mentioned that when user downloaded the data, the associated annotation data should also be " +
              "packaged into the download."
      });
    }

    annotation.id = uuid.v4();
    annotation.item = "TCGA-OR-" + Math.random().toString(36).substring(3,7).toUpperCase();
    annotation.type = "Aliquot";
    annotation.project = projects.hits[Math.round(Math.random() * (projects.hits.length - 1))];
    annotation.annotation = "SDRF";
    annotation.createdBy = "TCGA";
    annotation.classification = "CenterNotification";
    annotation.category = "Item Flagged DNU";
    annotation.dateCreated = new Date();
    annotation.rescinded = Math.round(Math.random()) ? true : false;
    annotation.status = Math.round(Math.random()) ? "Approved" : "Denied";

    newAnnotations.push(annotation);
  }

  annotations.hits = annotations.hits.concat(newAnnotations);

  return newAnnotations;
}

// Participants
var participants = {
  pagination: {"count": 20, "total": 50, "size": 0, "from": 1, "page": 1, "pages": 50, "sort": "totalDonorCount", "order": "desc"},
  facets: [
    {
      category: "Cancer program",
      terms: [
        "TCGA",
        "TARGET",
        "CGCI"
      ]
    },
    {
      category: "Project",
      terms: [
        "Chronic Lymphocytic Leukemia",
        "Ovarian Serous Cystadenocarcinoma",
        "Pancreatic Cancer",
        "Breast Cancer",
        "Pediatric Brain Tumors"
      ]
    },
    {
      category: "Primary Site",
      terms: [
        "Brain",
        "Breast",
        "Colon"
      ]
    },
    {
      category: "Gender",
      terms: [
        "Male",
        "Female"
      ]
    }
  ],
  hits: []
};

var statuses = [
  "Withdrawn",
  "Active",
  "In Trials"
];

var sites = [
  "Brain",
  "Colon",
  "Lung",
  "Breast",
  "Skin"
];

for (var j = 0; j < 70; j++) {
  var participant = {};

  participant.program = "TARGET";
  participant.code = "TCGA-OR-" + Math.random().toString(36).substring(3,7).toUpperCase();
  participant.number = Math.random().toString(36).substring(3,7).toUpperCase();
  participant.project = projects.hits[Math.round(Math.random() * (projects.hits.length - 1))];
  participant.id = participant.project.id + "-OR-" + Math.random().toString(36).substring(3,7).toUpperCase();
  participant.tumorStage = Math.max(1, Math.round(Math.random() * 4));
  participant.diseaseType = sites[Math.round(Math.random() * (sites.length - 1))];
  participant.status = statuses[Math.round(Math.random() * (statuses.length - 1))];
  participant.files = [];

  for (var i = 0; i < Math.round(Math.random() * 700); i++) {
    participant.files.push({});
  }

  participant.uuid = uuid.v4();
  participant.gender = Math.round(Math.random()) ? "Male" : "Female";
  participant.vitStatus = Math.round(Math.random()) ? "Deceased" : "Alive";
  participant.key = uuid.v1();

  participant.experiments = [
    {
      name: "RNA-Seq",
      samples: Math.round(Math.random() * 400),
      files: Math.round(Math.random() * 700)
    },
    {
      name: "WGS",
      samples: Math.round(Math.random() * 400),
      files: Math.round(Math.random() * 700)
    },
    {
      name: "WXS",
      samples: Math.round(Math.random() * 400),
      files: Math.round(Math.random() * 700)
    },
    {
      name: "miRNA-Seq",
      samples: Math.round(Math.random() * 400),
      files: Math.round(Math.random() * 700)
    },
    {
      name: "Bisulfite-Seq",
      samples: Math.round(Math.random() * 400),
      files: Math.round(Math.random() * 700)
    },
    {
      name: "Genotype Array",
      samples: Math.round(Math.random() * 400),
      files: Math.round(Math.random() * 700)
    }
  ];

  participant.data = [
    {
      name: "Clinical Data",
      files: Math.round(Math.random() * 700)
    },
    {
      name: "DNA Mutation",
      files: Math.round(Math.random() * 700)
    },
    {
      name: "DNA Copy Number",
      files: Math.round(Math.random() * 700)
    },
    {
      name: "mRNA Expression",
      files: Math.round(Math.random() * 700)
    },
    {
      name: "miRNA Expression",
      files: Math.round(Math.random() * 700)
    },
    {
      name: "Methylation",
      files: Math.round(Math.random() * 700)
    },
    {
      name: "Other",
      files: Math.round(Math.random() * 700)
    },
    {
      name: "Protein Expression",
      files: "-"
    }
  ];

  participant.annotations = createAnnotations(Math.round(Math.random() * 8));

  participants.hits.push(participant);
}

participants.pagination.total = participants.hits.length;
participants.pagination.pages = Math.ceil(participants.pagination.total /
                                          participants.pagination.count);

router.get('/participants', function (req, res) {
  var paging = JSON.parse(req.query.paging || "{}");

  var response = _.assign({}, participants);
  response.pagination = _.assign({}, participants.pagination);

  response.pagination.page = paging.page || 1;
  response.pagination.count = paging.count || participants.pagination.count;

  var hits = [];
  var start = paging.count * (paging.page - 1) || 0;

  for (var i = 0; i < response.pagination.count && response.hits[start + i]; i++) {
    hits.push(response.hits[start + i]);
  }

  response.pagination.pages = Math.ceil(response.pagination.total /
                                        response.pagination.count);


  response.hits = hits;
  res.json(response);
});
router.get('/participants/:id', function (req, res) {
  res.json(_.find(participants.hits, function (obj) {
    return obj.id === req.params.id;
  }));
});

// Files
var files = {
  pagination: {"count": 20, "total": 20, "size": 0, "from": 1, "page": 1, "pages": 50, "sort": "totalDonorCount", "order": "desc"},
  facets: [
    {
      category: "Data Type",
      terms: [
        "Clinical data",
        "Biospecimen data",
        "Pathology report",
        "WGS",
        "WXS",
        "RNA-Seq",
        "Protein expression array",
        "Gene expression array",
        "SNP array",
        "CGH array",
        "Simple somatic mutation",
        "Simple germline variation",
        "Structural rearrangement",
        "Copy number somatic mutation",
        "Probe level methylation value",
        "Methylation calls",
        "Differentially methylated regions",
        "Expression - exon",
        "Expression - splice junction",
        "Expression - isoform",
        "Expression - gene",
        "Expression - miRNA",
        "Protein expression",
        "Microsatellite instability"
      ]
    },
    {
      category: "Data category",
      terms: [
        "Clinical",
        "Sequencing data",
        "Microarray data",
        "SNV",
        "Structural rearrangement",
        "Copy number variation",
        "DNA methylation",
        "mRNA expression",
        "miRNA expression",
        "Protein expression",
        "Other"
      ]
    },
    {
      category: "File type",
      terms: [
        "BAM",
        "VCF",
        "MAF",
        "Clinical XML",
        "Biospecimen XML",
        "SRA metadata XML",
        "MAGE-Tab",
        "SVS",
        "PDF",
        "TSV"
      ]
    },
    {
      category: "Platform",
      terms: [
        "ABI",
        "Affymetrix U133 2.0",
        "Affymetrix SNP 6.0",
        "HG-CGH-244A",
        "HumanMethylation450",
        "Illumina GA",
        "Illumina HiSeq",
        "MDA_RPPA_Core"
      ]
    }
  ],
  hits: []
};

for(var m = 0; m < 70; m++) {
  var file = {};
  var fileCount = Math.round(Math.random()) ? 3 : 1;

  file.files = [];
  file.id = Math.random().toString(36).substring(3,9).toUpperCase();
  file.code = 'TCGA-59-2352-10A-01W-' + Math.round(Math.random() * 8000) + '-08';
  file.uuid = uuid.v4();
  file.filename = 'C239.' + file.code;

  for (var i = 0; i < fileCount; i++) {
    file.files.push({
      code: 'TCGA-59-2352-10A-01W-' + Math.round(Math.random() * 8000) + '-08',
      checksum: '9b8cebc0421241d087f6ab7e815285af803de7e7',
      filename: 'C239.' + file.code,
      published: new Date(),
      uploaded: new Date(),
      modified: new Date(),
      size: ((Math.random() * 2000000) / 1024).toFixed(2) + " GB",
      state: Math.round(Math.random()) ? 'Live' : 'Inactive'
    });
  }

  file.metadata = {
    'Study': 'TCGA',
    'Barcode': file.code,
    'Disease': 'OV',
    'Disease Name': 'Ovarian serous cystadenocarcinoma',
    'Sample Type': 'NB',
    'Sample Type Name': '10',
    'Analyte Type': 'WGA',
    'Library Type': 'WXS',
    'Center': 'BI',
    'Center Name': 'Broad Institute of MIT and Harvard',
    'Platform': 'Illumina',
    'Assembly': 'HG19_Broad_variant',
    'Analysis Id': uuid.v1(),
    'Aliquot Id': uuid.v1(),
    'Participant Id': uuid.v1(),
    'Sample Id': uuid.v1(),
    'TSS Id': 'Roswell Park: Ovarian serous cystadenocarcinoma 59',
    'Sample Accession': 'SRS061424'
  };

  file.metadataXML = {};

  _.forIn(file.metadata, function(val, key) {
    file.metadataXML[key.replace(/ /g, "-")] = val;
  });

  var baseXML = _.assign({}, file.metadataXML);

  file.metadataXML.a = _.assign({}, baseXML);
  file.metadataXML.f = _.assign({}, baseXML);
  file.metadataXML.a.d = _.assign({}, baseXML);

  // Note: XML generated in this fashion as a temporary means to do mockups.
  // Please remove the npm package when a real backend exists.
  file.metadataXML = require("js2xmlparser")('clinical', file.metadataXML, {
    declaration: {
      include: false
    }
  });

  files.hits.push(file);
}

files.pagination.total = files.hits.length;
files.pagination.pages = Math.ceil(files.pagination.total /
                                          files.pagination.count);

router.get('/files', function (req, res) {
  var paging = JSON.parse(req.query.paging || "{}");

  var response = _.assign({}, files);
  response.pagination = _.assign({}, files.pagination);

  response.pagination.page = paging.page || 1;
  response.pagination.count = paging.count || files.pagination.count;

  var hits = [];
  var start = paging.count * (paging.page - 1) || 0;

  for (var i = 0; i < response.pagination.count && response.hits[start + i]; i++) {
    hits.push(response.hits[start + i]);
  }

  response.pagination.pages = Math.ceil(response.pagination.total /
                                        response.pagination.count);

  response.hits = hits;
  res.json(response);
});
router.get('/files/:id', function (req, res) {
  res.json(_.find(files.hits, function (obj) {
    return obj.id === req.params.id;
  }));
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
