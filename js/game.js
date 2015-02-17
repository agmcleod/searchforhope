/* Game namespace */
var game = {
  abilities: {
    Dodge: true
  },
  onload: function () {
    // Initialize the video.
    var scale = '1';
    if(me.device.getPixelRatio() > 1 && !me.device.isMobile) {
      scale = '2';
    }

    if (!me.video.init("screen", me.video.CANVAS, 960, 640, true, scale)) {
      alert("Your browser does not support HTML5 canvas.");
      return;
    }

    // add "#debug" to the URL to enable the debug Panel
    // window.onReady(function () {
    //   me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
    //   me.debug.renderQuadTree = true;
    // });

    // Initialize the audio.
    me.audio.init("mp3,ogg");

    // Set a callback to run when loading is complete.
    me.loader.onload = this.loaded.bind(this);

    // Load the resources.
    me.loader.preload(game.resources);

    // Initialize melonJS and display a loading screen.
    me.state.change(me.state.LOADING);
  },

  // Run on game resources loaded.
  loaded: function () {
    this.atlas = new me.TextureAtlas(
      me.loader.getJSON("atlas"),
      me.loader.getImage("atlas")
    );
    this.playScreen = new game.PlayScreen();
    me.state.set(me.state.PLAY, this.playScreen);

    // Start the game.
    me.state.change(me.state.PLAY);
  }
};
