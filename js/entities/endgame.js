game.EndGame = me.Entity.extend({
  init: function (x, y, settings) {
    this._super(me.Entity, "init", [x, y, settings]);
  },

  onCollision: function (res, obj) {
    if (obj.name === 'player') {

    }
  },

  update: function (dt) {
    this._super(me.Entity, "update", [dt]);
    me.collision.check(this);
    return true;
  }
})