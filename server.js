// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); 		// call express
var _ = require('lodash'); 		// call lodash
var app = express(); 				// define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3001; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

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
  pagination: {"count": 0, "total": 50, "size": 0, "from": 1, "page": 1, "pages": 50, "sort": "totalDonorCount", "order": "desc"},
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
  pagination: {"count": 0, "total": 50, "size": 0, "from": 1, "page": 1, "pages": 50, "sort": "totalDonorCount", "order": "desc"},
  facets: [],
  hits: [
    {id: 'PR1', name: 'Project One'},
    {id: 'PR2', name: 'Project Two'},
    {id: 'PR3', name: 'Project Three'},
    {id: 'PR4', name: 'Project Four'},
    {id: 'PR5', name: 'Project Five'}
  ]};
router.get('/projects', function (req, res) {
  res.json(projects);
});
router.get('/projects/:id', function (req, res) {
  res.json(_.find(projects.hits, function (obj) {
    return obj.id === req.params.id;
  }));
});

// Participants
var participants = {
  pagination: {"count": 0, "total": 50, "size": 0, "from": 1, "page": 1, "pages": 50, "sort": "totalDonorCount", "order": "desc"},
  facets: [],
  hits: [
    { 
      id: 'P1',
      code: 'TCGA-OR-A5L9',
      number: 'A5L9'
    },
    { 
      id: 'P2',
      code: 'TCGA-OR-A4L8',
      number: 'A4L8'
    },
    { 
      id: 'P3',
      code: 'TCGA-OR-A3L7',
      number: 'A3L7'
    },
    { 
      id: 'P4',
      code: 'TCGA-OR-A2L6',
      number: 'A2L6'
    },
    { 
      id: 'P5',
      code: 'TCGA-OR-A1L5',
      number: 'A1L5'
    },
  ]};

  var statuses = [
    "Withdrawn",
    "Active",
    "In Trials"
  ];

  var sites = [
    "Brain",
    "Colon",
    "Lungs",
    "Breast",
    "Skin"
  ];

  var uuid = require("node-uuid");

  participants.hits.forEach(function(participant) {
    participant.site = sites[Math.round(Math.random() * sites.length)];
    participant.program = "TARGET";
    participant.status = statuses[Math.round(Math.random() * statuses.length)];
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
        name: "Protein Expression",
        files: "-"
      }
    ];

  });

router.get('/participants', function (req, res) {
  res.json(participants);
});
router.get('/participants/:id', function (req, res) {
  res.json(_.find(participants.hits, function (obj) {
    return obj.id === req.params.id;
  }));
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
