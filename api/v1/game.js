'use strict';
const c = require('../../common');
const colors = require('colors');
const express = require("express");

// Import the Data/DB interface
var PlayerAnswer = require(process.cwd() + "/models/player_answer_model");

//Init Router
const api = express.Router();

const questions = [
  { // questionIndex will be 0 for this question
    idx: 0,
    questionItem: 'Question 1: When Canada was founded? <br/><b>A</b> : July 1,1867.         <br/><b>B</b> : July 1,1868.',
    correctAnswer: 'A'
  },
  {
    idx: 1,
    questionItem: 'Question 2: What is the capital of Canada before Ottawa? <br/><b>A</b> : Newfoundland and Labrador. <br/><b>B</b> : Quebec City.',
    correctAnswer: 'B'
  },
  {
    idx: 2,
    questionItem: 'Question 3: Who is the first prime minister of canada? <br/><b>A</b> : John A. Macdonald. <br/><b>B</b> : Alexander Mackenzie.',
    correctAnswer: 'A'
  }
];

api.post("/get_question", (req, res) => {
  let idx = req.body.idx || 0;
  if (idx >= questions.length) { // no more questions
    res.status(204).send("no more questions");
  } else {
    res.send(questions[idx]);
  }
});

api.get("/get_question_count", (req, res) => {
  res.send({count: questions.length});
});

api.post("/answer_question", (req, res) => {
  let idx = req.body.idx;
  let answer = req.body.answer;
  let player = req.body.player;
  let gameGuid = req.body.gameGuid;
  if (idx == undefined) {
    res.status(400).send("Error: idx needed");
    return;
  }
  if (!answer) {
    res.status(400).send("Error: answer needed");
    return;
  }
  if (!player) {
    res.status(400).send("Error: player needed");
    return;
  }
  if (!gameGuid) {
    res.status(400).send("Error: game guid needed");
    return;
  }

  var playerAnswer = new PlayerAnswer(req.body);
  playerAnswer.score =
    (answer == questions[idx].correctAnswer) ? 1 : 0;
  // c.logWarn(playerAnswer.player + " answered: " + playerAnswer.answer);
  playerAnswer.save(function (err) {
    if(err){
      console.log(err);
      res.status(500).send("Error happend during processing -"
      + err.toString());
      return;
    }
    PlayerAnswer.findOne({_id: playerAnswer._id})
    .exec(function(err,playerAnswer){
      res.send(playerAnswer);
    });
  });
});

api.post("/game_result", (req, res) => {
  let gameGuid = req.body.gameGuid;
  if (!gameGuid) {
    res.status(400).send("Error: game guid needed");
    return;
  }
  let query = {gameGuid: gameGuid};
  PlayerAnswer.find(query).exec(function(err,results){
    res.send(results);
  });
});

api.get("/player_result", (req, res) => {
  let player = req.body.player;
  if (!player) {
    res.status(400).send("Error: player needed");
    return;
  }
  let query = {player: player};
  PlayerAnswer.find(query).exec(function(err,results){
    res.send(results);
  });
});

//Export Router
module.exports = api;