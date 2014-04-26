game.GreenThing = me.ObjectEntity.extend({
  init: function(x, y, settings) {
    settings['image'] = 'greenthing';
    settings['spritewidth'] = 32;
    settings['spriteheight'] = 32;
    this._super(me.ObjectEntity, 'init', [x, y, settings]);
    this.type = me.game.ENEMY_OBJECT;
  },

  onCollision: function(res, obj) {
    game.Enemy.onCollision(this, res, obj);
  },
});