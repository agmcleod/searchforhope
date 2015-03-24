game.EndGame = me.Entity.extend({
  init: function (x, y, settings) {
    this._super(me.Entity, "init", [x, y, settings]);
    this.body.collisionType = me.collision.types.ACTION_OBJECT;
  },

  onCollision: function (res, obj) {
    if (obj.name === 'player') {
      me.game.viewport.fadeIn('#ffffff', 1000, function () {
        var region = game.atlas.getRegion("end.png");
        var sprite = new me.Sprite(0, 0, game.atlas.getTexture(), region.width, region.height);
        sprite.floating = true;
        sprite.offset.setV(region.offset);
        me.game.world.addChild(sprite, 10);
      });
    }
  },

  update: function (dt) {
    this._super(me.Entity, "update", [dt]);
    me.collision.check(this);
    return true;
  }
})