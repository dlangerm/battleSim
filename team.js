// the model for the team object
var Soldier = require('soldier');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = new Schema({
  // the score, basically how many people you have completed - dead
  score: {type: Number, default: 0},
  name: {type: String, default: "team", unique: true},

  totalPoints: {type: Number, default: 10, min: 10, max: 100},

  // when the team's soldiers encounter an obstacle or a friendly,
  // in front of them, which direction do they go
  directionBias: {type: String, enum: ['left', 'right'],
    default: 'left'},

  // average armor value of the soldiers
  armorAvg: {type: Number, default: 5, min: 0, max: 100},
  weaponAvg: {type: Number, default: 50, min: 0, max: 100},
  // which type of weapon is used by 60% of the team, evenly split between
  // the other two types
  weaponBias: {type: String, enum: ['ranged', 'one-handed', 'two-handed'],
    default: 'left'}

},
{toObject: {virtuals: true}, toJSON: {virtuals: true}, connect: 'teams'});

// creates each soldier and stores it in the database
teamSchema.methods.createArmy(function(next) {
  var armySize = 0;
  var weaponType = ['ranged', 'one-handed', 'two-handed'];

  while (armySize < 100) {
    var soldierObj = {
      weapon: {
        // ranged can look ahead and shoot 2 spaces, 1 handed can attack forward,
        // two-handed can attack left right and forward, but has no chance to block
        weaponType: weaponType[0],
        damage: 50 % 100
      },
      armor: {
        // light = 30 +- 20, heavy = 70 +30 - 20, none = 0
        hardness: {type: Number, min: 0, max: 100, required: true},
        wear: {type: Number, min: 0, max: 100, default: 0, required: true}
      },
      dead: {type: Boolean, default: false, required: true},

      // surroundings
      sight: {
        left: {type: String, enum: ['friend', 'enemy', 'obstacle']},
        right: {type: String, enum: ['friend', 'enemy', 'obstacle']},
        fwd: {type: String, enum: ['friend', 'enemy', 'obstacle']},
        back: {type: String, enum: ['friend', 'enemy', 'obstacle']},
        bias: {type: String, enum: ['friend', 'enemy', 'obstacle']}
      },
      team: {type: Schema.Types.ObjectId, ref: 'Team', required: true},
      // y position on the board
      progress: {type: Number, default: 0, min: 0, max: 100, required: true},
      xPosition: {type: Number, default: 50, min: 0, max: 100, required: true}
    }
    --armySize;
  }
});

var team = mongoose.model('Team', teamSchema);
module.exports = team;
