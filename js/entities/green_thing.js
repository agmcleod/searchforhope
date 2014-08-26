game.GreenThing = me.Entity.extend({
  init: function(x, y, settings) {
    settings['image'] = 'greenthing';
    settings['spritewidth'] = 32;
    settings['spriteheight'] = 32;
    this._super(me.Entity, 'init', [x, y, settings]);
    this.body.collisionType = me.collision.types.ENEMY_OBJECT;
  },

  collideHandler: function (response) {
    switch (response.b.body.collisionType) {
      case me.collision.types.WORLD_SHAPE:
        this.pos.sub(response.overlapV);
        break;
    }
  },

  onCollision: function(res, obj) {
    game.enemy.onCollision(this, res, obj);
  },

  update: function(time) {
    this._super(me.Entity, 'update', [time]);
    me.collision.check(this, true, this.collideHandler.bind(this), true);
    return true;
  }
});