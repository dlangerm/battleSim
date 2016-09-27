// ****************************************************************************//
// Battle sim is a simple game written in node.js
// each player will get a certain number of points
// at the beginning of play, they may allocate those
// to different stats for their team. The game begins
// and each player's team is deployed in a simualted Battle
// the winner is the last one standing or the last one to get all of their
// pieces to the other side
// ****************************************************************************//

// battle object includes
// var Soldier = require('./soldier');
var Team = require('./team');

// mongoose db set up
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/battle');

// express set up for server
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var httpStatusCodes = require('http-status-codes');

var app = express();
app.use(bodyParser);
app.use(morgan('combined'));

// initialize the battle field, send team object, populate the soldier and team
// database with players
app.route('/init')
.post(function(req, res) {
  // figure out what action to take
  var teamA = req.body.teamA;
  var teamB = req.body.teamB;

  Team.create(teamA, function(err, teamRetA) {
    if (err) {
      console.log(err);
      res.status(httpStatusCodes.BAD_REQUEST).send();
    } else {
      // team a created
      var A = teamRetA;

      Team.create(teamB, function(err, teamRetB) {
        if (err) {
          console.log(err);
          res.status(httpStatusCodes.BAD_REQUEST).send();
        } else {
          console.log('Team B created');
          res.json({teamA: A, teamB: teamRetB});
        }
      });

      console.log('Team A created');
    }
  });
})
.all(function(req, res) {
  res.status(httpStatusCodes.METHOD_NOT_ALLOWED).send();
});

app.listen('3000', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Playing!!');
  }
});
