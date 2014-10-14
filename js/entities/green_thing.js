game.GreenThing = me.Entity.extend({
  init: function(x, y, settings) {
    settings.width = 32;
    settings.height = 32;
    this.startpatrol = settings['startpatrol'];
    this.endpatrol = settings['endpatrol'];
    this.direction = (!! Math.round(Math.random() * 1)) ? -1 : 1;
    this._super(me.Entity, 'init', [x, y, settings]);

    this.body.setVelocity(3, 0);
    this.body.collisionType = me.collision.types.ENEMY_OBJECT;

    this.renderable = new me.AnimationSheet(0, 0, {
      image: game.atlas.getTexture(),
      spritewidth: this.width,
      spriteheight: this.height,
      region: game.atlas.getRegion("greenthing.png")
    });

    if (this.direction > 0) {
      this.renderable.flipX(true);
    }

    this.renderable.addAnimation("walk", [0,1,2,3,2,1], 25);
    this.renderable.setCurrentAnimation("walk");
  },

  onCollision: function(res, obj) {
    return game.enemy.onCollision(this, res, obj);
  },

  update: function(time) {
    this._super(me.Entity, 'update', [time]);
    game.patrolBehaviour.execute(this);
    if (this.dead !== true) {
      this.body.update();
    }
    me.collision.check(this);
    
    return true;
  }
});