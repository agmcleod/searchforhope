game.GreenThing = me.ObjectEntity.extend({
  init: function(x, y, settings) {
    settings['image'] = 'greenthing';
    settings['spritewidth'] = 32;
    settings['spriteheight'] = 32;
    this._super(me.ObjectEntity, 'init', [x, y, settings]);
    this.type = me.game.ENEMY_OBJECT;
  },

  onCollision: function(res, obj) {
    game.enemy.onCollision(this, res, obj);
  },

  update: function(time) {
    this._super(me.ObjectEntity, 'update', [time]);
    return true;
  }
});