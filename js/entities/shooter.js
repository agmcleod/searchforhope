game.Shooter = me.Sprite.extend({
  init: function (x, y, settings) {
    var region = game.atlas.getRegion(settings.image || "shooter.png");
    this._super(me.Sprite, "init", [x, y, game.atlas.getTexture(), region.width, region.height]);
    this.offset.setV(region.offset);
  },

  destroy: function () {},

  onActivateEvent: function () {
    var _this = this;
    this.interval = me.timer.setInterval(function () {
      me.game.world.addChild(me.pool.pull("projectile", _this.pos.x, _this.pos.y));
    }, 800);
  },

  onDeactivateEvent: function () {
      me.timer.clearInterval(this.interval);
  },
});