game.PlayScreen = me.ScreenObject.extend({
  bindKeys: function() {
    me.input.bindKey(me.input.KEY.A, 'left');
    me.input.bindKey(me.input.KEY.D, 'right');
    me.input.bindKey(me.input.KEY.SPACE, 'jump');
    me.input.bindKey(me.input.KEY.E, 'dash');
    me.input.bindPointer(me.input.KEY.E);
  },

  lowerHealth: function() {
    this.playerHealth--;
  },
  /**
   *  action to perform on state change
   */
  onResetEvent: function() {
    this.bindKeys();
    this.uiFont = new me.Font('Arial', '10px', '#ff0000');
    me.pool.register('player', game.Player);
    me.pool.register('greenthing', game.GreenThing, true);
    this.resetHealth();
    me.levelDirector.loadLevel('intro');
  },


  /**
   *  action to perform when leaving this screen (state change)
   */
  onDestroyEvent: function() {
    me.input.unbindKey(me.input.KEY.A);
    me.input.unbindKey(me.input.KEY.D);
    me.input.unbindKey(me.input.KEY.E);
    me.input.unbindKey(me.input.KEY.SPACE);
    me.input.unbindPointer();
  },

  resetHealth: function() {
    this.playerHealth = 3;
  }
});
