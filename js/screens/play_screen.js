game.PlayScreen = me.ScreenObject.extend({
  bindKeys: function() {
    me.input.bindKey(me.input.KEY.A, 'left');
    me.input.bindKey(me.input.KEY.D, 'right');
    me.input.bindKey(me.input.KEY.SPACE, 'jump', true);
    me.input.bindKey(me.input.KEY.E, 'dash');
    me.input.bindKey(me.input.KEY.SHIFT, 'dodge');
    me.input.bindPointer(me.input.KEY.E);
  },

  loadCheckpoint: function () {
    me.levelDirector.loadLevel(this.checkpoint);
  },

  loadPickupNPC: function (levelName) {
    if (levelName === "leveloneb" && !game.abilities.Dodge) {
      me.game.world.addChild(me.pool.pull("dodgeitem", 1339, 478, { width: 32, height: 32 }));
    }
    if (levelName === "levelthreea" && !game.abilities.Glide) {
      me.game.world.addChild(me.pool.pull("glide", 285, 333, { width: 50, height: 50 }));
    }
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
      'intro': 'Ld29p1',
      'levelone': 'Ld29p1',
      'leveloneb': 'Ld29p1',
      'levelonec': 'Ld29p1',
      'surfacetwo': 'Ld29p1',
      'leveltwo': 'Ld29p1',
      'leveltwob': 'Ld29p1',
      'leveltwoc': 'Ld29p1',
      'leveltwod': 'Ld29p1',
      'levelthreea': 'Ld29p2',
      'levelthreeb': 'Ld29p2',
      'levelthreec': 'Ld29p2',
      'final': 'Ld29final'
    };

    var _this = this;

    this.checkpoint = 'intro';

    me.event.subscribe(me.event.LEVEL_LOADED, function (levelName) {
      // rebind player reference
      game.player = me.game.world.getChildByName("player")[0];

      var track = game.playScreen.tracksForLevels[levelName];
      if (me.audio.getCurrentTrack() !== track.toLowerCase()) {
        me.audio.stopTrack();
        me.audio.playTrack(track);
      }

      if (levelName.indexOf('levelone') !== -1) {
        _this.checkpoint = 'intro';
      }
      else if (levelName.indexOf('leveltwo') !== -1) {
        _this.checkpoint = 'leveltwo';
      }
      else if (levelName.indexOf('levelthree') !== -1) {
        _this.checkpoint = 'levelthreea';
      }

      _this.loadPickupNPC(levelName);

      if (levelName === 'surfacetwo' && !_this.surfaceTwoTextShown) {
        _this.surfaceTwoTextShown = true;
        _this.startDialogue(game.player.pos.x, game.player.pos.y, ["surfacetwomsg1.png", "surfacetwomsg2.png"], game.player.pos);
      }
    });

    var levelString = location.hash.indexOf('#level=') !== -1 ? (location.hash + '').replace('#level=','') : 'intro';

    me.levelDirector.loadLevel(levelString);
    this.instructionsComplete = false;
    game.InstructionsManager.init();
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

  nextInstructions: function (state) {
    if (!this.instructionsComplete) {
      this.instructionsComplete = game.InstructionsManager.nextState(state);
    }
  },

  registerEntities: function () {
    me.pool.register('blackthing', game.BlackThing, true);
    me.pool.register('campsite', game.Campsite, false);
    me.pool.register('dialogue', game.Dialogue);
    me.pool.register('dodgeitem', game.DodgeItem);
    me.pool.register('endgame', game.EndGame);
    me.pool.register('game.PositionLevelEntity', game.PositionLevelEntity, false);
    me.pool.register('glide', game.GlideItem);
    me.pool.register('greenthing', game.GreenThing, true);
    me.pool.register('greet', game.GreetNPC, false);
    me.pool.register('me.Tween', me.Tween);
    me.pool.register('player', game.Player);
    me.pool.register('projectile', game.Projectile);
    me.pool.register('redthing', game.RedThing, true);
    me.pool.register('shooter', game.Shooter);
  },

  resetHealth: function() {
    this.playerHealth = 3;
  },

  startDialogue: function (x, y, regionNames, follow) {
    me.input.bindKey(me.input.KEY.ENTER, 'next', true);
    me.game.world.addChild(me.pool.pull('dialogue', x, y, regionNames, follow), 10);
  },

  stopDialogue: function () {
    me.input.unbindKey(me.input.KEY.ENTER);
  }
});