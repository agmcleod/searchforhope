game.GreenThing = me.Entity.extend({
  init: function(x, y, settings) {
    settings['image'] = 'greenthing';
    settings['spritewidth'] = 32;
    settings['spriteheight'] = 32;
    this.startpatrol = settings['startpatrol'];
    this.endpatrol = settings['endpatrol'];
    this.direction = (!! Math.round(Math.random() * 1)) ? -1 : 1;
    this._super(me.Entity, 'init', [x, y, settings]);
    this.body.setVelocity(3, 0);
    this.body.collisionType = me.collision.types.ENEMY_OBJECT;

    if (this.direction > 0) {
      this.flipX(true);
    }

    this.renderable.addAnimation("walk", [0,1,2,3,2,1], 25);
    this.renderable.setCurrentAnimation("walk");
  },

  collideHandler: function () {

  },

  onCollision: function(res, obj) {
    game.enemy.onCollision(this, res, obj);
  },

  update: function(time) {
    this._super(me.Entity, 'update', [time]);
    game.enemy.patrol(this);
    me.collision.check(this, true, this.collideHandler.bind(this), true);
    this.body.update();
    return true;
  }
});