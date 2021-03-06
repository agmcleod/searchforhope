game.GreetNPC = me.Entity.extend({
  init: function (x, y, settings) {
    this._super(me.Entity, "init", [x, y, settings]);
    var region = game.atlas.getRegion("dodge.png");
    this.renderable = new me.Sprite(0, 0, game.atlas.getTexture(), region.width, region.height);
    this.renderable.offset.setV(region.offset);
    this.body.setVelocity(0, 0);
    this.body.collisionType = me.collision.types.COLLECTABLE_OBJECT;
    this.type = 'dodge';
    this.triggered = false;
    this.z = 3;
  },

  onCollision: function (res, obj) {
    if (obj.name === "player") {
      if (!this.triggered) {
        this.triggered = true;
        game.playScreen.startDialogue(this.pos.x + 150, this.pos.y, ['finalmessageone.png', 'finalmessagetwo.png', 'finalmessagethree.png', 'finalmessagefour.png']);
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