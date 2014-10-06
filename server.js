// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); 		// call express
var _ = require('lodash'); 		// call lodash
var app = express(); 				// define our app using express
var bodyParser = require('body-parser');
var uuid = require('node-uuid');

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

var files = {
  pagination: {"count": 0, "total": 50, "size": 0, "from": 1, "page": 1, "pages": 50, "sort": "totalDonorCount", "order": "desc"},
  facets: [],
  hits: [
    { id: 'F1' },
    { id: 'F2' },
    { id: 'F3' },
    { id: 'F4' },
    { id: 'F5' }
  ]};

files.hits.forEach(function(file) {
  var fileCount = Math.round(Math.random()) ? 3 : 1;

  file.files = [];
  file.code = 'TCGA-59-2352-10A-01W-' + Math.round(Math.random() * 8000) + '-08';
  file.uuid = uuid.v4();
  file.filename = 'C239.' + file.code;

  for (var i = 0; i < fileCount; i++) {
    file.files.push({
      code: 'TCGA-59-2352-10A-01W-' + Math.round(Math.random() * 8000) + '-08',
      checksum: '9b8cebc0421241d087f6ab7e815285af803de7e7',
      filename: 'C239.' + file.code,
      published: '2013-05-23',
      uploaded: '2013-05-23',
      modified: '2013-06-03',
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

  // Note: XML generated in this fashion as a temporary means to do mockups.
  // Please remove the npm package when a real backend exists.
  file.metadataXML = require("js2xmlparser")('clinical', file.metadata);
});

router.get('/files', function (req, res) {
  res.json(files);
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