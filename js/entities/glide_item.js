game.GlideItem = me.Entity.extend({
  init: function (x, y, settings) {
    this._super(me.Entity, "init", [x, y, settings]);
    var region = game.atlas.getRegion("glide.png");
    this.renderable = new me.Sprite(0, 0, game.atlas.getTexture(), region.width, region.height);
    this.renderable.offset.setV(region.offset);
    this.body.addShape(new me.Rect(0, 0, this.width, this.height));
    this.body.setVelocity(0, 0);
    this.body.collisionType = me.collision.types.COLLECTABLE_OBJECT;
    this.type = 'glide';
    this.triggered = false;
    this.z = 3;
  },

  onCollision: function (res, obj) {
    if (obj.name === "player") {
      if (!this.triggered) {
        this.triggered = true;
        game.playScreen.startDialogue(this.pos.x, this.pos.y, ['floatmessageone.png', 'floatmessagetwo.png', 'floatmessagethree.png', 'floatmessagefour.png', 'floatmessagefive.png', 'floatmessagesix.png']);
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
});