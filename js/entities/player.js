game.Player = me.Entity.extend({
  init: function (x, y, settings) {
    settings.width = 32;
    settings.height = 32;
    this._super(me.Entity, "init", [x, y, settings]);
    var shape = this.body.getShape(0);
    shape.translate(2, 0);
    shape.scale(24 / 32, 1);
    this.body.updateBounds();
    this.setMovementVelocity();
    this.body.setFriction(1.5, 0);
    this.body.collisionType = me.collision.types.PLAYER_OBJECT;

    this.renderable = new me.AnimationSheet(0, 0, {
      image: game.atlas.getTexture(),
      spritewidth: this.width,
      spriteheight: this.height,
      region: game.atlas.getRegion("player.png")
    });

    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    this.health = game.playScreen.playerHealth;
    this.dashing = false;
    this.direction = new me.Vector2d();

    this.renderable.addAnimation('dash', [0], 1);
    this.renderable.addAnimation('run', [1,2,3,4,5,6,7,8,9], 20);
    this.renderable.setCurrentAnimation('run');

    var messageOneRegion = game.atlas.getRegion("messageone.png");
    this.messageOneSprite = new me.Sprite(this.pos.x, this.pos.y, game.atlas.getTexture(), messageOneRegion.width, messageOneRegion.height);
    this.messageOneSprite.offset.setV(messageOneRegion.offset);

    var messageTwoRegion = game.atlas.getRegion("messagetwo.png");
    this.messageTwoSprite = new me.Sprite(this.pos.x, this.pos.y, game.atlas.getTexture(), messageTwoRegion.width, messageTwoRegion.height);
    this.messageTwoSprite.offset.setV(messageTwoRegion.offset);
  },

  damagedCallback: function () {
    this.damaged = false;
  },

  draw: function (renderer) {
    this._super(me.Entity, 'draw', [renderer]);
    if(this.damaged) {
      game.playScreen.uiFont.draw(renderer.getContext(), this.health, this.pos.x - 10, this.pos.y - 10);
    }

    if(game.playScreen.drawMessageOne) {
      this.messageOneSprite.pos.set(this.pos.x + this.width, this.pos.y - this.messageOneSprite.height);
      this.messageOneSprite.draw(renderer);
    }
    else if(game.playScreen.drawMessageTwo) {
      this.messageTwoSprite.pos.set(this.pos.x + this.width, this.pos.y - this.messageTwoSprite.height);
      this.messageTwoSprite.draw(renderer);
    }
  },

  handleInput: function () {
    if (!this.dashing) {
      if (me.input.isKeyPressed('left')) {
        this.renderable.flipX(true);
        this.body.vel.x -= this.body.accel.x * me.timer.tick;
        this.movementSetup();
      }
      else if (me.input.isKeyPressed('right')) {
        this.renderable.flipX(false);
        this.body.vel.x += this.body.accel.x * me.timer.tick;
        this.movementSetup();
      }
    }

    if (this.body.vel.x === 0 && !this.renderable.isCurrentAnimation("dash")) {
      this.renderable.setCurrentAnimation("dash");
    }

    if (me.input.isKeyPressed('jump')) {
      this.jumpState = (this.body.vel.y === 0)?1:this.jumpState;

      if (this.jumpState <= 1) {
        this.body.vel.y -= (this.body.maxVel.y * this.jumpState++) * me.timer.tick;
      }
    }

    if (me.input.isKeyPressed('dash') && !this.dashing && !this.body.jumping) {
      this.dashing = true;
      this.setDashVelocity();
      var mousePos = me.game.viewport.localToWorld(me.input.mouse.pos.x, me.input.mouse.pos.y);
      this.direction.set((mousePos.x - this.pos.x), (mousePos.y - this.pos.y));
      this.direction.normalize();
      this.direction.scaleV(this.body.maxVel);
      this.renderable.setCurrentAnimation('dash');
      this.body.vel.add(this.direction);
      if(this.direction.x < 0) {
        this.renderable.flipX(true);
      }
      else {
        this.renderable.flipX(false);
      }
    }
  },

  movementSetup: function () {
    if(!this.renderable.isCurrentAnimation('run')) {
      this.renderable.setCurrentAnimation('run');
    }
  },

  onCollision: function (response, other) {
    switch (other.body.collisionType) {
      case me.collision.types.ENEMY_OBJECT:
        if (!this.damaged) {
          this.damaged = true;
          this.health -= 1;
          game.playScreen.lowerHealth();
          if(this.health <= 0) {
            game.playScreen.resetHealth();
            this.renderable.flicker(300, function () {
              me.levelDirector.loadLevel.defer(this, 'intro');
            });
          }
          else {
            this.renderable.flicker(300, this.damagedCallback.bind(this));
          }
        }

        return false;
        break;
      case me.collision.types.ACTION_OBJECT:
        return false;
        break;
      default:
        return true;


    };
  },

  setDashVelocity: function () {
    this.body.setVelocity(22, 30);
  },

  setDefaultAnimation: function () {
    this.renderable.setCurrentAnimation('run');
  },

  setMovementVelocity: function () {
    this.body.setVelocity(5, 21);
  },

  update: function (time) {
    this.handleInput();

    this.body.update();
    me.collision.check(this);

    if (this.body.vel.x !== 0 || this.body.vel.y !== 0) {
      this._super(me.Entity, 'update', [time]);
    }
    else if(this.dashing) {
      this.dashing = false;
      this.setMovementVelocity();
    }
    return true;
  }
});