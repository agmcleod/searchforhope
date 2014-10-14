game.EndSprite = me.Sprite.extend({
  init: function() {
    var region = game.atlas.getRegion('end.png');
    var x = me.game.viewport.width / 2 - region.width / 2;
    var y = me.game.viewport.height / 2 - region.height / 2;

    this._super(me.SpriteObject, 'init', [x, y, game.atlas.getTexture(), region.width, region.height]);
    this.offset.setV(region.offset);
    this.startTime = me.timer.getTime();
    this.alpha = 0;
    this.floating = true;
  },

  update: function(time) {
    if(this.alpha < 1 && (me.timer.getTime() - this.startTime) > 200) {
      this.alpha += 0.1;
      this.startTime = me.timer.getTime();
    }
    this._super(me.Sprite, "update", [time]);
  }
});