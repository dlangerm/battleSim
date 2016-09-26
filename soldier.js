var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var soldierSchema = new Schema({
  // stats
  vitals: {
    // 0 = dead, self explanatory
    health: {type: Number, default: 100, min: 0, max: 100, required: true},
    // can move 1 per stamina point, idle turn += 1 to stamina
    stamina: {type: Number, default: 10, min: 0, max: 100, required: true}
  },
  weapon: {
    // ranged can look ahead and shoot 2 spaces, 1 handed can attack forward,
    // two-handed can attack left right and forward, but has no chance to block
    weaponType: {type: String, enum: ['ranged', 'one-handed', 'two-handed'],
     default: 'one-handed', required: true},
    damage: {type: Number, default: 1, min: 0, max: 100, required: true}
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
},
{toObject: {virtuals: true}, toJSON: {virtuals: true}, connect: 'soldiers'});

soldierSchema.virtual('armor.AC').get(function() {
  return this.armor.hardness - this.armor.wear;
});

var soldier = mongoose.model('Soldier', soldierSchema);

module.exports = soldier;
