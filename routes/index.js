var express = require('express');
var router = express.Router();
var Estimator = require('../estimator')
var jsonToXml = require('jsontoxml')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/', async (req, res) => {
  const use = await Estimator(req.body);
  res.status(200).json({
    data: use.data,
    impact: use.impact,
    severeImpact: use.severeImpact
  });
});

router.post('/json', async (req, res) => {
  const use = await Estimator(req.body);
  res.status(200).json({
    data: use.data,
    impact: use.impact,
    severeImpact: use.severeImpact
  });
});

router.post('/xml', async (req, res) => {
  const use = await Estimator(req.body);
  res.header('content-Type', 'routerlication/xml; charset=UTF-8');

  // console.log(jsonToXml(use))
  // console.log(jsonToXml({ root: use }))

  res.send(jsonToXml({ root: use }, 'xmlHeader'));
});
module.exports = router;
