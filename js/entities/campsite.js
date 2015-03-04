game.Campsite = me.Entity.extend({
  init: function (x, y, settings) {
    this._super(me.Entity, "init", [x, y, settings]);
    var region = game.atlas.getRegion("campsite.png");
    this.renderable = new me.Sprite(0, 0, game.atlas.getTexture(), region.width, region.height);
    this.renderable.offset.setV(region.offset);
    this.body.collisionType = me.collision.types.COLLECTABLE_OBJECT;
    this.body.setVelocity(0, 0);
    this.triggered = false;
  },

  onCollision: function (res, obj) {
    if (obj.name === "player") {
      if (!this.triggered) {
        this.triggered = true;
        game.playScreen.startDialogue(obj.pos.x, obj.pos.y, ['campmsgone.png', 'campmsg2.png'], obj.pos);
      }
      return false;
    }
  },

  update: function (dt) {
    this._super(me.Entity, "update", [dt]);
    this.body.update();
    me.collision.check(this);
    return false;
  }
})