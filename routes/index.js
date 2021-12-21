var express = require('express');
require('dotenv').config()
var router = express.Router();
const fs = require("fs")

/* GET home page. */
router.get('/', function(req, res, next) {
  const dataBuffer = fs.readFileSync('./data/reaction-game.json')
  const dataJson = JSON.parse(dataBuffer.toString())
  res.json({data: [...dataJson.recode.slice(-4)].reverse()})
});

router.get('/all', function(req, res, next) {
  const dataBuffer = fs.readFileSync('./data/reaction-game.json')
  const dataJson = JSON.parse(dataBuffer.toString())
  res.json({data: [...dataJson.recode].reverse()})
});

router.post('/', function(req, res, next) {
  if (!req.body.name || !req.body.score) {
    res.status(400).json({message: "NEED_NAME_AND_SCORE"})
    return
  }
  if (req.body.key !== process.env.API_KEY) {
    res.status(403).json({message: "WRONG_KEY"})
  }

  const dataBuffer = fs.readFileSync('./data/reaction-game.json')
  const dataJson = JSON.parse(dataBuffer.toString())

  dataJson.recode.push({
    name: req.body.name,
    score: req.body.score,
    date: (new Date()).toISOString()
  })

  fs.writeFileSync('./data/reaction-game.json', JSON.stringify(dataJson))

  res.json({message: 'DATA_SUCCESSFUL_ADDED'});
});

module.exports = router;
