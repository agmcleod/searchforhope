game.TitleScreen = me.ScreenObject.extend({
  addBackground: function (atlas1) {
    var bg = atlas1.createSpriteFromName("bg.png");
    me.game.world.addChild(bg, 1);
    var clouds = atlas1.createSpriteFromName("clouds.png");
    this.centerOnX(clouds);
    clouds.pos.y = - 100;
    this.tweenForSprite(clouds.pos, { y: 0}, 1000);
    me.game.world.addChild(clouds, 2);
  },

  addBackCities: function (atlas0) {
    var backback = atlas0.createSpriteFromName("backbackcity.png");
    var startBackPos = 650 - backback.height;
    backback.pos.y = startBackPos
    this.tweenForSprite(backback.pos, { y: 200 }, 1350);
    me.game.world.addChild(backback, 3);

    var backcity = atlas0.createSpriteFromName("backcity.png");
    backcity.pos.y = startBackPos + 150;
    this.tweenForSprite(backcity.pos, { y: 290 }, 1400);
    me.game.world.addChild(backcity, 4);
  },

  addForeGround: function (atlas1) {
    var foreGround = atlas1.createSpriteFromName("foreground.png");
    foreGround.pos.y = me.game.viewport.height - 50;
    this.tweenForSprite(foreGround.pos, { y: me.game.viewport.height - foreGround.height }, 1550, (function () {
      var title = atlas1.createSpriteFromName("title.png");
      title.alpha = 0.0;
      title.pos.y = me.game.viewport.height / 2 - title.height / 2;
      me.game.world.addChild(title, 9);
      this.tweenForSprite(title, { alpha: 1.0 }, 500);
      me.input.registerPointerEvent("pointerdown", me.game.viewport, this.startPlay);
    }).bind(this));
    me.game.world.addChild(foreGround, 8);
  },

  addFrontCity: function (atlas0) {
    var city = atlas0.createSpriteFromName("forwardcity.png");
    city.pos.y = 200;
    this.tweenForSprite(city.pos, { y: 0 }, 1500);
    me.game.world.addChild(city, 5);
  },

  addVignette: function (atlas1) {
    var filter = atlas1.createSpriteFromName("vignette.png");
    me.game.world.addChild(filter, 7);
  },

  centerOnX: function (sprite) {
    sprite.pos.x = ((me.game.viewport.width - sprite.width) / 2) * -1;
  },

  onResetEvent: function () {
    var atlas0 = new me.TextureAtlas(me.loader.getJSON("titleatlas0"), me.loader.getImage("titleatlas0"));
    var atlas1 = new me.TextureAtlas(me.loader.getJSON("titleatlas1"), me.loader.getImage("titleatlas1"));
    this.addBackground(atlas1);
    this.addBackCities(atlas0);
    this.addForeGround(atlas1);
    this.addFrontCity(atlas0);
    this.addVignette(atlas1);
  },

  startPlay: function () {
    me.input.releasePointerEvent("pointerdown", me.game.viewport, this.startPlay);
    me.game.viewport.fadeIn('#000000', 500, function () {
      me.state.change(me.state.PLAY);
    });
  },

  tweenForSprite: function (object, targetObject, duration, callback) {
    var tween = me.pool.pull("me.Tween", object).to(targetObject, duration).easing(me.Tween.Easing.Sinusoidal.Out).start();
    if (callback) {
      tween.onComplete(callback);
    }
  }
});