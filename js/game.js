
/* Game namespace */
var game = {

  onload: function () {
    // Initialize the video.
    var scale = '1';
    if(me.device.getPixelRatio() > 1 && !me.device.isMobile) {
      scale = '2';
    }
    if (!me.video.init("screen", 960, 640, true, scale)) {
      alert("Your browser does not support HTML5 canvas.");
      return;
    }

    // add "#debug" to the URL to enable the debug Panel
    if (document.location.hash === "#debug") {
      window.onReady(function () {
         me.plugin.register.defer(this, debugPanel, "debug", me.input.KEY.V);
      });
    }

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
    this.playScreen = new game.PlayScreen();
    me.state.set(me.state.PLAY, this.playScreen);

    // Start the game.
    me.state.change(me.state.PLAY);
  }
};
