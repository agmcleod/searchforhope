game.PlayScreen = me.ScreenObject.extend({
  bindKeys: function() {
    me.input.bindKey(me.input.KEY.A, 'left');
    me.input.bindKey(me.input.KEY.D, 'right');
    me.input.bindKey(me.input.KEY.SPACE, 'jump', true);
    me.input.bindKey(me.input.KEY.E, 'dash');
    me.input.bindKey(me.input.KEY.SHIFT, 'dodge');
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
    this.uiFont = new me.Font('Arial', '12px', '#ff0000');

    this.registerEntities();

    this.resetHealth();

    this.tracksForLevels = {
      'intro': 'ld29p1',
      'levelone': 'ld29p1',
      'leveloneb': 'ld29p1',
      'levelonec': 'ld29p1',
      'surfacetwo': 'ld29p1',
      'leveltwo': 'ld29p1',
      'leveltwob': 'ld29p1',
      'leveltwoc': 'ld29p1',
      'leveltwod': 'ld29p1',
      'levelthree': 'ld29p2',
      'final': 'ld29final'
    };

    me.event.subscribe(me.event.LEVEL_LOADED, function (levelName) {
      // rebind player reference
      game.player = me.game.world.getChildByName("player")[0];

      // Checking bound keys
      var track = game.playScreen.tracksForLevels[levelName];
      if (me.audio.getCurrentTrack() !== track) {
        me.audio.stopTrack();
        me.audio.playTrack(track);
      }

      if(levelName === 'final') {
        me.timer.setTimeout(function() {
          game.playScreen.drawMessageTwo = true;
          var mt = new game.MessageTimer('drawMessageTwo');
          mt.setStartTime();
          me.game.world.addChild(mt);
        }, 1000);

        me.timer.setTimeout(function() {
          me.game.world.addChild(new game.EndSprite(), 1000);
        }, 10000);
      }
      else {
        game.playScreen.drawMessageOne = false;
      }
    });

    var levelString = location.hash.indexOf('#level=') !== -1 ? (location.hash + '').replace('#level=','') : 'intro';

    me.levelDirector.loadLevel(levelString);

    this.drawMessageOne = levelString === "intro";
    this.drawMessageTwo = false;

    var mt = new game.MessageTimer('drawMessageOne');
    mt.setStartTime();
    me.game.world.addChild(mt, 0);
  },


  /**
   *  action to perform when leaving this screen (state change)
   */
  onDestroyEvent: function() {
    me.input.unbindKey(me.input.KEY.A);
    me.input.unbindKey(me.input.KEY.D);
    me.input.unbindKey(me.input.KEY.E);
    me.input.unbindKey(me.input.KEY.SPACE);
    me.input.unbindKey(me.input.KEY.SHIFT);
    me.input.unbindPointer();
  },

  registerEntities: function () {
    me.pool.register('player', game.Player);
    me.pool.register('greenthing', game.GreenThing, true);
    me.pool.register('redthing', game.RedThing, true);
    me.pool.register('blackthing', game.BlackThing, true);
    me.pool.register('dodgeitem', game.DodgeItem);
    me.pool.register('shooter', game.Shooter);
    me.pool.register('projectile', game.Projectile);
    me.pool.register('game.PositionLevelEntity', game.PositionLevelEntity, false);
  },

  resetHealth: function() {
    this.playerHealth = 3;
  }
});


game.MessageTimer = Object.extend({
  init: function(field, limit) {
    this.timeLimit = limit || 5000;
    this.field = field;
  },

  setStartTime: function() {
    this.startTime = me.timer.getTime();
  },

  update: function(time) {
    if(me.timer.getTime() - this.startTime > this.timeLimit) {
      game.playScreen[this.field] = false;
      me.game.world.removeChild(this);
    }
  }
});