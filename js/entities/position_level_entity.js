game.PositionLevelEntity = me.LevelEntity.extend({
  init: function(x, y, settings) {
    this._super(me.LevelEntity, 'init', [x, y, settings]);
    this.settings = settings;
  },

  onFadeComplete: function() {
    me.levelDirector.loadLevel(this.gotolevel);
    me.game.viewport.fadeOut(this.fade, this.duration);
    if(this.settings.to_x) {
      var player = me.game.world.getChildByName('player')[0];
      player.pos.set(this.settings.to_x, this.settings.to_y);
      player.body.update();
      if(this.settings.flip !== null || typeof this.settings.flip !== 'undefined') {
        player.renderable.flipX(this.settings.flip);
      }
    }
  }
});