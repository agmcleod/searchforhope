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
    me.pool.register('redthing', game.RedThing, true);
    me.pool.register('blackthing', game.BlackThing, true);
    this.resetHealth();
    me.levelDirector.loadLevel('intro');
    me.audio.playTrack('Ld29p1');

    this.tracksForLevels = {
      'intro': 'Ld29p1',
      'levelone': 'Ld29p1',
      'leveloneb': 'Ld29p1',
      'leveltwo': 'Ld29p1',
      'levelthree': 'Ld29p2',
      'final': 'Ld29final'
    };

    me.event.subscribe(me.event.LEVEL_LOADED, function (levelName) {
      // Checking bound keys
      var track = game.playScreen.tracksForLevels[levelName];

      if (me.audio.getCurrentTrack() !== track) {
        me.audio.stopTrack();
        me.audio.playTrack(track);
      }
    });
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
