game.Shooter = me.Renderable.extend({
  init: function (x, y, settings) {
    this._super(me.Renderable, "init", [x, y, 32, 32]);
  },

  destroy: function () {},

  draw: function (renderer) {
    var color = renderer.getColor();
    renderer.setColor("#ff0000");
    renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    renderer.setColor(color);
  },

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