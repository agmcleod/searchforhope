game.InstructionsManager = {
  init: function () {
    this.state = 'left';
    var region = game.atlas.getRegion("instructions-left.png");
    var sprite = new me.Sprite(50, 0, game.atlas.getTexture(), region.width, region.height);
    sprite.offset.setV(region.offset);
    sprite.floating = true;
    me.game.world.addChild(sprite, 10);
    this.sprite = sprite;
  },

  nextState: function (state) {
    var _this = this;
    if (this.transitioning || state !== this.state) {
      return null;
    }
    switch (this.state) {
      case "left":
        this.transitioning = true;
        this.state = 'right';
        this.tweenSprite(function () {
          var region = game.atlas.getRegion("instructions-right.png");
          _this.sprite.offset.setV(region.offset);
          _this.sprite.resize(region.width, region.height);
          _this.sprite.pos.x = 550;
        });

        break;
      case "right":
        this.state = "jump";
        this.transitioning = true;
        this.tweenSprite(function () {
          var region = game.atlas.getRegion("jump-instructions.png");
          _this.sprite.offset.setV(region.offset);
          _this.sprite.resize(region.width, region.height);
          _this.sprite.pos.x = 250;
          _this.sprite.pos.y = 50;
        });
        break;
      case "jump":
        this.transitioning = true;
        me.pool.pull("me.Tween", this.sprite).to({ alpha: 0.0 }).start().onComplete(function () {
          _this.state = 'dash';
          _this.transitioning = false;
        });
        break;
      case "dash":
        var region = game.atlas.getRegion("dashinstructions.png");
        this.sprite.offset.setV(region.offset);
        this.sprite.resize(region.width, region.height);
        this.sprite.pos.set(350, 0);
        me.pool.pull("me.Tween", this.sprite).to({ alpha: 1.0 }).start().onComplete(function () {
          _this.state = 'dashhide';
          _this.transitioning = false;
          me.timer.setTimeout(function () {
            me.pool.pull("me.Tween", _this.sprite).to({ alpha: 0.0 }).start().onComplete(function () {
              me.game.world.removeChild(_this.sprite);
              _this.transitioning = false;
            });
          }, 1800);
        });
        break;
      default:
        break;
    }
  },

  tweenSprite: function (callback) {
    var _this = this;
    me.pool.pull("me.Tween", this.sprite).to({ alpha: 0.0 }, 600).start().onComplete(function () {
      _this.transitioning = false;
      callback();
      me.pool.pull("me.Tween", _this.sprite).to({ alpha: 1.0 }, 600).start();
    });
  }
};