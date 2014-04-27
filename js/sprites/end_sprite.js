game.EndSprite = me.SpriteObject.extend({
  init: function() {
    var image = me.loader.getImage('end');
    var x = me.game.viewport.width / 2 - image.width / 2;
    var y = me.game.viewport.height / 2 - image.height / 2;

    this._super(me.SpriteObject, 'init', [x, y, image]);
    this.startTime = me.timer.getTime();
    this.alpha = 0;
    this.floating = true;
  },

  update: function(time) {
    if(this.alpha < 1 && (me.timer.getTime() - this.startTime) > 200) {
      this.alpha += 0.1;
      this.startTime = me.timer.getTime();
    }
    me.SpriteObject.prototype.update.call(this, time);
  }
});