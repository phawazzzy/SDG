var express = require('express');
var router = express.Router();
var Estimator = require('../estimator')
var jsonToXml = require('jsontoxml')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/api/v1/on-covid-19/', async (req, res) => {
  const use = await Estimator(req.body);
  res.status(200).json({
    data: use.data,
    impact: use.impact,
    severeImpact: use.severeImpact
  });
});

router.post('/api/v1/on-covid-19/json', async (req, res) => {
  const use = await Estimator(req.body);
  res.status(200).json({
    data: use.data,
    impact: use.impact,
    severeImpact: use.severeImpact
  });
});

router.post('/api/v1/on-covid-19/xml', async (req, res) => {
  const use = await Estimator(req.body);
  res.header('content-Type', 'routerlication/xml; charset=UTF-8');
  res.send(jsonToXml(use));
});
module.exports = router;
