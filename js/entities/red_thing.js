game.RedThing = me.Entity.extend({
  init: function(x, y, settings) {
    settings['image'] = 'redthing';
    settings['spritewidth'] = 32;
    settings['spriteheight'] = 32;
    this._super(me.Entity, 'init', [x, y, settings]);
    this.body.collisionType = me.collision.types.ENEMY_OBJECT;
    this.body.setVelocity(2.0, 20);
    this.body.setFriction(0.5, 0);
    this.renderable.addAnimation("move", [0,1,2,3,2,1], 40);
    this.renderable.addAnimation("idle", [0], 40);
    this.renderable.setCurrentAnimation("idle");

    this.maxChase = 250;
  },

  onCollision: function(res, obj) {
    return game.enemy.onCollision(this, res, obj);
  },

  update: function(time) {
    this._super(me.Entity, 'update', [time]);
    game.chaseBehaviour.execute(this, game.player.pos);
    this.body.update();

    if (this.body.vel.x === 0 && !this.renderable.isCurrentAnimation("idle")) {
      this.renderable.setCurrentAnimation("idle");
    }
    else if (this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("move")) {
      this.renderable.setCurrentAnimation("move");
    }

    me.collision.check(this);
    return true;
  }
});