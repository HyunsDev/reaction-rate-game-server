var express = require('express');
require('dotenv').config()
var router = express.Router();
const fs = require("fs")

/* GET home page. */
router.get('/', function(req, res, next) {
  const dataBuffer = fs.readFileSync('./data/reaction-game.json')
  const dataJson = JSON.parse(dataBuffer.toString())
  res.json({data: {
    record: [...dataJson.record.slice(-4)].reverse(),
    rank: [...dataJson.rank]
  }})
});

router.get('/all', function(req, res, next) {
  const dataBuffer = fs.readFileSync('./data/reaction-game.json')
  const dataJson = JSON.parse(dataBuffer.toString())
  res.json({data: {
    record: [...dataJson.record].reverse(),
    rank: [...dataJson.rank].reverse()
  }})
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

  dataJson.record.push({
    name: req.body.name,
    score: req.body.score,
    date: (new Date()).toISOString()
  })

  dataJson.rank.push({
    name: req.body.name,
    score: req.body.score,
    date: (new Date()).toISOString()
  })

  if (dataJson.rank.length >= 2) {
    dataJson.rank.sort((a, b) => {
      return a.score < b.score ? -1 : a.score > b.score ? 1 : 0;
    });
  }

  dataJson.rank = dataJson.rank.slice(0,3)

  fs.writeFileSync('./data/reaction-game.json', JSON.stringify(dataJson))

  res.json({message: 'DATA_SUCCESSFUL_ADDED'});
});

module.exports = router;
