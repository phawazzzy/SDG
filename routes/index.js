var express = require('express');
var router = express.Router();
var Estimator = require('../estimator')
var jsonToXml = require('jsontoxml')
var fs = require('fs');


/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'Express' });
// });


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
  res.header('content-Type', 'application/xml; charset=UTF-8');
  res.send(jsonToXml({ root: use }, 'xmlHeader'));
});

router.get('/logs', (req, res) => {
  fs.readFile('access.txt', (err, data) => {
    if (err) throw err;
    // if (err.code === 'ENOENT') console.log('file not dound')
    res.header('Content-Type', 'text/plain')
    // res.setHeader('content-type', 'text/plain')s;
    res.send(data)
  });
});
module.exports = router;
