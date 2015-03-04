game.Dialogue = me.Sprite.extend({
  init: function (x, y, regions, targetVector) {
    var region = game.atlas.getRegion(regions[0]);
    this.regions = regions;
    this.regionIndex = 0;
    this._super(me.Sprite, "init", [x - region.width, y - region.height, game.atlas.getTexture(), region.width, region.height]);
    this.offset.setV(region.offset);
    this.targetVector = targetVector;
  },

  update: function () {
    if (me.input.isKeyPressed('next')) {
      this.regionIndex++;
      if (this.regionIndex >= this.regions.length) {
        game.playScreen.stopDialogue();
        me.game.world.removeChild(this);
      }
      else {
        var region = game.atlas.getRegion(this.regions[this.regionIndex]);
        this.offset.setV(region.offset);
      }
    }

    if (this.targetVector) {
      this.pos.set(this.targetVector.x - this.width, this.targetVector.y - this.height);
    }
  }
});