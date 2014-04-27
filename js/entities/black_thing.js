game.BlackThing = me.ObjectEntity.extend({
  init: function(x, y, settings) {
    settings['image'] = 'blackthing';
    settings['spritewidth'] = 64;
    settings['spriteheight'] = 64;
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