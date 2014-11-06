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
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});


// test route to make sure everything is working (accessed at GET http://localhost:3001/api)
router.get('/', function (req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here
// Projects
var projects = {
  pagination: {"count": 20, "total": 50, "size": 0, "from": 1, "page": 1, "pages": 50, "sort": "totalDonorCount", "order": "desc"},
  facets: {
    "diseaseType": {
      value: "Disease Type",
      terms: [
        "Brain"
      ]
    },
    "program": {
      value: "Program",
      terms: [
        "TCGA"
      ]
    },
    "status": {
      value: "Status",
      terms: [
        "Active",
        "Legacy"
      ]
    },
    "dataType": {
      value: "Data Type",
      terms: [
        "Clinical",
        "Raw sequencing data",
        "Raw microarray data",
        "SNV calls",
        "Structural rearrangement",
        "Copy number variation",
        "DNA methylation",
        "mRNA Expression",
        "miRNA Expression",
        "Protein Expression",
        "Other"
      ]
    },
    "experimentalStrategy": {
      value: "Experimental Strategy",
      terms: [
        "RNA-seq",
        "WGS",
        "WXS",
        "miRNA-Seq",
        "Bisulfite-Seq",
        "Genotype array"
      ]
    }
  },
  hits: [
    {id: 'PR1', name: 'Project One'},
    {id: 'PR2', name: 'Project Two'},
    {id: 'PR3', name: 'Project Three'},
    {id: 'PR4', name: 'Project Four'},
    {id: 'PR5', name: 'Project Five'}
  ]};
projects.hits.forEach(function(project) {
  project.name = "Neuroblastoma";
  project.code = "NBL-TARGET";
  project.program = "TARGET";
  project.status = "Legacy";
  var analyzedData = {
    "Clinical":
      {
        participantCount: Math.round(Math.random() * 700),
        fileCount: Math.round(Math.random() * 600)
      },
    "Raw sequencing data":
      {
        participantCount: Math.round(Math.random() * 700),
        fileCount: Math.round(Math.random() * 600)
      },
    "Raw microarray data":
      {
        participantCount: Math.round(Math.random() * 700),
        fileCount: Math.round(Math.random() * 600)
      },
    "SNV":
      {
        participantCount: Math.round(Math.random() * 700),
        fileCount: Math.round(Math.random() * 600)
      },
    "Structural rearrangement":
      {
        participantCount: Math.round(Math.random() * 700),
        fileCount: Math.round(Math.random() * 600)
      },
    "Copy number variation":
      {
        participantCount: Math.round(Math.random() * 700),
        fileCount: Math.round(Math.random() * 600)
      },
      "DNA methylation":
      {
        participantCount: Math.round(Math.random() * 700),
        fileCount: Math.round(Math.random() * 600)
      },
      "mRNA Expression":
      {
        participantCount: Math.round(Math.random() * 700),
        fileCount: Math.round(Math.random() * 600)
      },
      "miRNA Expression":
      {
        participantCount: Math.round(Math.random() * 700),
        fileCount: Math.round(Math.random() * 600)
      },
      "Protein Expression":
      {
        participantCount: Math.round(Math.random() * 700),
        fileCount: Math.round(Math.random() * 600)
      },
      "Other":
      {
        participantCount: Math.round(Math.random() * 700),
        fileCount: Math.round(Math.random() * 600)
      }
  };
  var experimentalData = [
    {
      experimentalType: "RNA-Seq",
      participantCount: Math.round(Math.random()* 300),
      fileCount: Math.round(Math.random()*100),
      sampleCount: Math.round(Math.random()*100)
    },
    {
      experimentalType: "WGS",
      participantCount: Math.round(Math.random()* 300),
      fileCount: Math.round(Math.random()*100),
      sampleCount: Math.round(Math.random()*100)
    },
    {
      experimentalType: "WXS",
      participantCount: Math.round(Math.random()* 300),
      fileCount: Math.round(Math.random()*100),
      sampleCount: Math.round(Math.random()*100)
    },
    {
      experimentalType: "miRNA-Seq",
      participantCount: Math.round(Math.random()* 300),
      fileCount: Math.round(Math.random()*100),
      sampleCount: Math.round(Math.random()*100)
    },
    {
      experimentalType: "Bisulfite-Seq",
      participantCount: Math.round(Math.random()* 300),
      fileCount: Math.round(Math.random()*100),
      sampleCount: Math.round(Math.random()*100)
    },
    {
      experimentalType: "Geotype Array",
      participantCount: Math.round(Math.random()* 300),
      fileCount: Math.round(Math.random()*100),
      sampleCount: Math.round(Math.random()*100)
    }
  ];

  var analyzedDataCounts = _.reduce(analyzedData, function(total, item) {
    total.fileCount += item.fileCount;
    total.participantCount += item.participantCount;
    return total;
  }, { fileCount: 0, participantCount: 0 });

  var experimentalDataCounts = experimentalData.reduce(function(total, item) {
    total.fileCount += item.fileCount;
    total.participantCount += item.participantCount;
    return total;
  }, { fileCount: 0, participantCount: 0 });

  project.summary = {
    analyzedData: analyzedData,
    experimentalData: experimentalData,
    fileCount: analyzedDataCounts.fileCount + experimentalDataCounts.fileCount,
    participantCount: analyzedDataCounts.participantCount + experimentalDataCounts.participantCount
  };
  project.diseaseType = "Brain";
  project.sequencingCenter = "BI";
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
  var paging = JSON.parse(req.query.paging || "{}");

  var response = {};
  response.pagination = _.assign({}, annotations.pagination);
  response.facets = _.assign([], annotations.facets);
  response.hits = [];

  response.pagination.page = paging.page || 1;
  response.pagination.count = paging.count || annotations.pagination.count;

  var start = paging.count * (paging.page - 1) || 0;

  for (var i = 0; i < response.pagination.count && annotations.hits[start + i]; i++) {
    response.hits.push(_.assign({}, annotations.hits[start + i]));
  }

  response.pagination.pages = Math.ceil(response.pagination.total /
                                        response.pagination.count);

  res.json(response);
});
router.get('/annotations/:id', function (req, res) {
  var id = parseInt(req.params.id);
  res.json(_.find(annotations.hits, function (obj) {
    return obj.id === id;
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

    annotation.uuid = uuid.v4();
    annotation.id = Math.round(Math.random() * 30000);
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
  facets: {
    "cancerProgram": {
      value: "Cancer Program",
      terms: [
        "TCGA",
        "TARGET",
        "CGCI"
      ]
    },
    "project": {
      value: "Project",
      terms: [
        "Chronic Lymphocytic Leukemia",
        "Ovarian Serous Cystadenocarcinoma",
        "Pancreatic Cancer",
        "Breast Cancer",
        "Pediatric Brain Tumors"
      ]
    },
    "primarySite": {
      value: "Primary Site",
      terms: [
        "Brain",
        "Breast",
        "Colon"
      ]
    },
    "gender": {
      value: "Gender",
      terms: [
        "Male",
        "Female"
      ]
    }
  },
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

var fileParticipantCount = 70;

function generateParticipants(count) {
  var newParticipants = [];

  for (var j = 0; j < count; j++) {
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
    participant.annotations = [];
    for (var k = 0; k < Math.round(Math.random() * 10); k++) {
      participant.annotations.push({});
    }
    participant.uuid = uuid.v4();
    participant.gender = Math.round(Math.random()) ? "Male" : "Female";
    participant.vitalStatus = Math.round(Math.random()) ? "Deceased" : "Alive";
    participant.key = uuid.v1();
    participant.sample = Math.random().toString(36).substring(3,18);
    participant.portion = Math.random().toString(36).substring(3,18);
    participant.analyte = Math.random().toString(36).substring(3,18);
    participant.aliquot = Math.random().toString(36).substring(3,18);

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

    newParticipants.push(participant);
  }

  participants.hits = participants.hits.concat(newParticipants);

  participants.pagination.total = participants.hits.length;
  participants.pagination.pages = Math.ceil(participants.pagination.total /
                                            participants.pagination.count);

  return newParticipants;
}

generateParticipants(fileParticipantCount);

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
router.get('/participants', function (req, res) {
  var paging = JSON.parse(req.query.paging || "{}");

  var response = {};
  response.pagination = _.assign({}, participants.pagination);
  response.facets = _.assign({}, participants.facets);
  response.hits = [];

  response.pagination.page = paging.page || 1;
  response.pagination.count = paging.count || participants.pagination.count;

  var start = paging.count * (paging.page - 1) || 0;

  for (var i = 0; i < response.pagination.count && participants.hits[start + i]; i++) {
    response.hits.push(_.assign({}, participants.hits[start + i]));
  }

  response.pagination.pages = Math.ceil(response.pagination.total /
                                        response.pagination.count);

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
  facets: {
    "dataType": {
      value: "Data Type",
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
    "dataCategory": {
      value: "Data Category",
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
    "fileType": {
      value: "File Type",
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
    "platform": {
      value: "Platform",
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
  },
  hits: []
};

var fileFormats = [
  "BAM",
  "MAG",
  "SRA",
  "BAM.BAI"
];

var fileDataTypes = [
  "Clinical",
  "Research"
];

function generateFiles(count) {
  var newFiles = [];

  for(var m = 0; m < count; m++) {
    var file = {};

    file.id = Math.random().toString(36).substring(3,9).toUpperCase();
    file.barcode = "TCGA-59-2352-10A-01W-" + Math.round(Math.random() * 8000) + "-08";
    file.uuid = uuid.v4();
    file.format = fileFormats[Math.round(Math.random() * (fileFormats.length - 1))];
    file.filename = "C239." + file.barcode + "." + file.format.toLowerCase();
    file.checksum = "9b8cebc0421241d087f6ab7e815285af803de7e7";
    file.published = new Date();
    file.uploaded = new Date();
    file.modified = new Date();
    file.size = parseFloat(((Math.random() * 2000000) / 1024).toFixed(2));
    file.state = Math.round(Math.random()) ? "Live" : "Inactive";
    file.access = Math.round(Math.random()) ? true : false;
    file.participants = generateParticipants(Math.max(1, Math.round(Math.random() * 5)));
    file.dataType = fileDataTypes[Math.round(Math.random() * (fileDataTypes.length - 1))];
    file.dataSubType = file.dataType + " Data";
    file.experimentStrategy = "WXS";
    file.programStatus = Math.round(Math.random()) ? true : false;
    file.platform = "Illumina";
    file.revision = "1.2." + Math.round(Math.random() * 14);
    file.version = "Publication A";
    file.level = Math.round(Math.random() * 5);
    file.submitter = "UNC";
    file.submittedSince = new Date();
    file.url = "/files/" + file.id;

    // Randomly set to be part of an archive or not.
    if (Math.round(Math.random())) {
      file.archive = {
        name: Math.random().toString(36).substring(3,15) + ".tar.gz"
      };
    }

    file.metadata = {
      "Study": "TCGA",
      "Barcode": file.code,
      "Disease": "OV",
      "Disease Name": "Ovarian serous cystadenocarcinoma",
      "Sample Type": "NB",
      "Sample Type Name": "10",
      "Analyte Type": "WGA",
      "Library Type": "WXS",
      "Center": "BI",
      "Center Name": "Broad Institute of MIT and Harvard",
      "Platform": "Illumina",
      "Assembly": "HG19_Broad_variant",
      "Analysis Id": uuid.v1(),
      "Aliquot Id": uuid.v1(),
      "Participant Id": uuid.v1(),
      "Sample Id": uuid.v1(),
      "TSS Id": "Roswell Park: Ovarian serous cystadenocarcinoma 59",
      "Sample Accession": "SRS061424"
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
    file.metadataXML = require("js2xmlparser")("clinical", file.metadataXML, {
      declaration: {
        include: false
      }
    });

    newFiles.push(file);
  }

  files.hits = files.hits.concat(newFiles);
  files.pagination.total = files.hits.length;
  files.pagination.pages = Math.ceil(files.pagination.total /
                                     files.pagination.count);

  return newFiles;
}

generateFiles(fileParticipantCount);

// Add related files
var cachedLength = files.hits.length;
for (var m = 0; m < cachedLength; m++) {
  files.hits[m].related = generateFiles(Math.max(1, Math.round(Math.random() * 5)));
  files.hits[m].project = projects.hits[Math.round(Math.random() * (projects.hits.length - 1))];
}

cachedLength = annotations.hits.length;
for (var m = 0; m < cachedLength; m++) {
  annotations.hits[m].participant = generateParticipants(1)[0];
}

router.get('/files', function (req, res) {
  var paging = JSON.parse(req.query.paging || "{}");

  var response = {};
  response.pagination = _.assign({}, files.pagination);
  response.facets = _.assign({}, files.facets);
  response.hits = [];

  response.pagination.page = paging.page || 1;
  response.pagination.count = paging.count || files.pagination.count;

  var start = paging.count * (paging.page - 1) || 0;

  for (var i = 0; i < response.pagination.count && files.hits[start + i]; i++) {
    response.hits.push(_.assign({}, files.hits[start + i]));
  }

  response.pagination.pages = Math.ceil(response.pagination.total /
                                        response.pagination.count);

  res.json(response);
});

router.post('/files', function (req, res) {
  var paging = JSON.parse(req.query.paging || "{}");
  var filters = req.body.filters;

  var response = {};
  response.pagination = _.assign({}, files.pagination);
  response.facets = _.assign({}, files.facets);
  response.hits = [];

  response.pagination.page = paging.page || 1;
  response.pagination.count = paging.count || files.pagination.count;

  var start = paging.count * (paging.page - 1) || 0;

  var filteredFiles = _.filter(files.hits, function (file) {
    return _.contains(filters.id, file.id);
  });

  response.pagination.total = filteredFiles.length;
  response.pagination.pages = Math.ceil(response.pagination.total /
                                        response.pagination.count);

  for (var i = 0; i < response.pagination.count && filteredFiles[start + i]; i++) {
    response.hits.push(_.assign({}, filteredFiles[start + i]));
  }

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

// START the SERVER
// =============================================================================
app.listen(port);
