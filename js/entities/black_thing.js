game.BlackThing = me.Entity.extend({
  init: function(x, y, settings) {
    settings['width'] = 64;
    settings['height'] = 64;
    this._super(me.Entity, 'init', [x, y, settings]);
    this.body.collisionType = me.collision.types.ENEMY_OBJECT;
    this.body.setVelocity(4.0, 20);
    this.body.setFriction(0.5, 0);

    this.renderable = new me.AnimationSheet(0, 0, {
      image: game.atlas.getTexture(),
      spritewidth: this.width,
      spriteheight: this.height,
      region: game.atlas.getRegion("blackthing.png")
    });

    this.renderable.addAnimation("idle", [0], 1);
    this.renderable.addAnimation("warp", [1,2,3], 20);
    this.renderable.setCurrentAnimation("idle");
    this.maxChase = 160;
    this.stopDiff = 50;

    this.warpCooldown = 750;
    this.warpTime = me.timer.getTime();
  },

  onCollision: function(res, obj) {
    return game.enemy.onCollision(this, res, obj);
  },

  update: function(time) {
    this._super(me.Entity, 'update', [time]);
    var t = me.timer.getTime();
    if (t - this.warpTime > this.warpCooldown && game.chaseBehaviour.execute(this, game.player.pos)) {
      if (!this.renderable.isCurrentAnimation("warp")) {
        this.renderable.setCurrentAnimation("warp");
      }
    }
    else {
      if (!this.renderable.isCurrentAnimation("idle")) {
        this.warpTime = t;
        this.renderable.setCurrentAnimation("idle");
      }
    }

    if (this.dead !== true) {
      this.body.update();
    }

    me.collision.check(this);
    return true;
  }
});