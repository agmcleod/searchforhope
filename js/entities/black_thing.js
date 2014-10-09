game.BlackThing = me.Entity.extend({
  init: function(x, y, settings) {
    settings['image'] = 'blackthing';
    settings['spritewidth'] = 64;
    settings['spriteheight'] = 64;
    this._super(me.Entity, 'init', [x, y, settings]);
    this.body.collisionType = me.collision.types.ENEMY_OBJECT;

    this.renderable.addAnimation("idle", [0], 1);
    this.renderable.addAnimation("warp", [1,2,3,2,1], 25);
    this.renderable.setCurrentAnimation("idle");
  },

  onCollision: function(res, obj) {
    return game.enemy.onCollision(this, res, obj);
  },

  update: function(time) {
    this._super(me.Entity, 'update', [time]);
    this.body.update();
    me.collision.check(this);
    return true;
  }
});