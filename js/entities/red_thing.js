game.RedThing = me.Entity.extend({
  init: function(x, y, settings) {
    settings['image'] = 'redthing';
    settings['spritewidth'] = 32;
    settings['spriteheight'] = 32;
    this._super(me.Entity, 'init', [x, y, settings]);
    this.body.collisionType = me.collision.types.ENEMY_OBJECT;
    this.renderable.addAnimation("idle", [0,1,2,3,2,1], 40);
    this.renderable.setCurrentAnimation("idle");
  },

  onCollision: function(res, obj) {
    return game.enemy.onCollision(this, res, obj);
  },

  update: function(time) {
    this._super(me.Entity, 'update', [time]);
    return true;
  }
});