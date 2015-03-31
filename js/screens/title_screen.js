game.TitleScreen = me.ScreenObject.extend({
  addBackground: function (atlas0) {
    var bg = atlas0.createSpriteFromName("bg.png");
    me.game.world.addChild(bg, 1);
    var clouds = atlas0.createSpriteFromName("clouds.png");
    this.centerOnX(clouds);
    clouds.pos.y = - 100;
    this.tweenForSprite(clouds.pos, { y: 0}, 1500);
    me.game.world.addChild(clouds, 2);
  },

  addBackCities: function (atlas1) {
    var backback = atlas1.createSpriteFromName("backbackcity.png");
    var startBackPos = 650 - backback.height;
    backback.pos.y = startBackPos
    this.tweenForSprite(backback.pos, { y: 200 }, 1350);
    me.game.world.addChild(backback, 3);

    var backcity = atlas1.createSpriteFromName("backcity.png");
    backcity.pos.y = startBackPos + 150;
    this.tweenForSprite(backcity.pos, { y: 290 }, 1400);
    me.game.world.addChild(backcity, 4);
  },

  addForeGround: function (atlas1) {
    var foreGround = atlas1.createSpriteFromName("foreground.png");
    foreGround.pos.y = me.game.viewport.height - 50;
    this.tweenForSprite(foreGround.pos, { y: me.game.viewport.height - foreGround.height }, 1500, (function () {
      this.addTitle(atlas1);
    }).bind(this));
    me.game.world.addChild(foreGround, 8);
  },

  addFrontCity: function (atlas0) {
    var city = atlas0.createSpriteFromName("forwardcity.png");
    city.pos.y = 200;
    this.tweenForSprite(city.pos, { y: 0 }, 1500);
    me.game.world.addChild(city, 5);
  },

  addTitle: function (atlas1) {
    var blackBg = atlas1.createSpriteFromName("black.png");
    blackBg.scale(1, 0.01);
    blackBg.pos.y = me.game.viewport.height / 2 - blackBg.height / 2;
    me.game.world.addChild(blackBg, 9);
    this.tweenForSprite({y: 0.01}, { y: 1.0}, 500, (function () {
      var title = atlas1.createSpriteFromName("text.png");
      title.alpha = 0.0;
      title.pos.y = me.game.viewport.height / 2 - title.height / 2;
      me.game.world.addChild(title, 10);
      this.tweenForSprite(title, { alpha: 1.0 }, 500);
      me.input.registerPointerEvent("pointerdown", me.game.viewport, this.startPlay);
    }).bind(this)).onUpdate(function () {
      blackBg.scale(1, this.y);
    }).start();
  },

  addVignette: function (atlas0) {
    var filter = atlas0.createSpriteFromName("vignette.png");
    me.game.world.addChild(filter, 7);
  },

  centerOnX: function (sprite) {
    sprite.pos.x = ((me.game.viewport.width - sprite.width) / 2) * -1;
  },

  onResetEvent: function () {
    var atlas0 = new me.TextureAtlas(me.loader.getJSON("titleatlas0"), me.loader.getImage("titleatlas0"));
    var atlas1 = new me.TextureAtlas(me.loader.getJSON("titleatlas1"), me.loader.getImage("titleatlas1"));
    this.addBackground(atlas0);
    this.addBackCities(atlas1);
    this.addForeGround(atlas1);
    this.addFrontCity(atlas0);
    this.addVignette(atlas0);
    me.audio.playTrack("title");
  },

  startPlay: function () {
    me.input.releasePointerEvent("pointerdown", me.game.viewport, this.startPlay);
    me.game.viewport.fadeIn('#000000', 500, function () {
      me.state.change(me.state.PLAY);
    });
  },

  tweenForSprite: function (object, targetObject, duration, callback) {
    var tween = me.pool.pull("me.Tween", object).to(targetObject, duration * 2.5).easing(me.Tween.Easing.Sinusoidal.Out).start();
    if (callback) {
      tween.onComplete(callback);
    }

    return tween;
  }
});