game.Projectile = me.Entity.extend({
  init: function (x, y) {
    x -= 16;
    var settings = {
      width: 16,
      height: 16
    };
    this._super(me.Entity, "init", [x, y, settings]);
    this.renderable = new (me.Renderable.extend({
      init: function () {
        this._super(me.Renderable, "init", [x, y, 16, 16]);
      },

      destroy: function () {},

      draw: function (renderer) {
        var color = renderer.getColor();
        renderer.setColor('#aa0000');
        renderer.fillRect(0, 0, this.width, this.height);
        renderer.setColor(color);
      }
    }));

    this.body.addShape(new me.Rect(0, 0, 16, 16));
    this.body.setVelocity(10, 0);

    this.startPosX = this.pos.x;
  },

  onCollision: function (obj, res) {
    if (!obj.dodging) {
      me.game.world.removeChild(this);
    }
    return false;
  },

  update: function (dt) {
    if (Math.abs(this.startPosX - this.pos.x) > 500) {
      me.game.world.removeChild(this);
    }
    this.body.vel.x -= this.body.accel.x * dt;
    this.body.update();
    me.collision.check(this);
  }
})