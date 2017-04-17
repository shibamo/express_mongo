'use strict';

//引入mongoose
const mongoose = require("mongoose");

var playerAnswerSchema = mongoose.Schema({ 
  gameGuid: {type: String, required: true}, //
  player: {type: String, required: true}, //
  idx: { type: Number, required: true}, //
  answer: { type: String, required: true}, //
  score: { type: Number, required: true}, //
  answerDate: {type: Date}, //
});

var PlayerAnswer = mongoose.model("PlayerAnswer", playerAnswerSchema);

module.exports = PlayerAnswer;