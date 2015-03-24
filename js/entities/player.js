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

    this.name = 'player';

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
    this.renderable.addAnimation('glide', [10, 11, 12, 11], 20);
    this.renderable.setCurrentAnimation('run');

    for (var ability in game.abilities) {
      if (game.abilities.hasOwnProperty(ability)) {
        this['can' + ability] = game.abilities[ability];
      }
    };
  },

  damagedCallback: function () {
    this.damaged = false;
  },

  dieCallback: function () {
    this.renderable.flicker(300, function () {
      game.playScreen.resetHealth();
      me.game.viewport.fadeIn('#000000', 200, function () {
        game.playScreen.loadCheckpoint();
        me.game.viewport.fadeOut('#000000', 200);
      });
    });
  },

  draw: function (renderer) {
    this._super(me.Entity, 'draw', [renderer]);
    if(this.damaged) {
      game.playScreen.uiFont.draw(renderer.getContext(), this.health, this.pos.x - 10, this.pos.y - 10);
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

    if (me.input.isKeyPressed('dodge') && this.canDodge && !this.dodging) {
      this.dodging = true;
      this.renderable.setOpacity(0.5);
      this.timeout = me.timer.setTimeout((function () {
        this.dodging = false;
        this.renderable.setOpacity(1);
      }).bind(this), 500);
    }

    if (this.body.vel.x === 0 && !this.renderable.isCurrentAnimation("dash") && !this.renderable.isCurrentAnimation('glide')) {
      this.renderable.setCurrentAnimation("dash");
    }

    if (me.input.isKeyPressed('jump')) {
      this.jumpState = (this.body.vel.y === 0)?1:this.jumpState;

      if (this.canGlide && !this.gliding && this.jumpState > 1) {
        this.glideTime = me.timer.getTime();
        this.gliding = true;
        this.body.setVelocity(8, 0);
        this.jumpState = 2;
        this.renderable.setCurrentAnimation('glide');
      }

      this.body.jumping = true;

      if (!this.gliding && this.jumpState <= 1) {
        this.body.vel.y -= (this.body.maxVel.y * this.jumpState++) * me.timer.tick;
      }
    }
    else if (!this.body.falling && !this.body.jumping) {
      this.jumpState = 1;
    }

    if (me.input.isKeyPressed('dash') && !this.dashing && this.body.vel.y !== 0) {
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
    if(!this.renderable.isCurrentAnimation('run') && !this.renderable.isCurrentAnimation('glide')) {
      this.renderable.setCurrentAnimation('run');
    }
  },

  onCollision: function (response, other) {
    switch (other.body.collisionType) {
      case me.collision.types.ENEMY_OBJECT:
        this.takeDamage();

        return false;
        break;
      case me.collision.types.COLLECTABLE_OBJECT:
        if (other.type === 'dodge') {
          this.canDodge = true;
          game.abilities.Dodge = true;
        }
        if (other.type === 'glide') {
          this.canGlide = true;
          game.abilities.Glide = true;
        }
        return false;
        break;
      case me.collision.types.ACTION_OBJECT:
        return false;
        break;
      case me.collision.types.WORLD_SHAPE:
        if (other.type === "spikes") {
          this.takeDamage();
        }
        else if (other.type === "lava") {
          this.health = 0;
          this.takeDamage();
        }
        return true;
        break;
      default:
        return true;


    };
  },

  onDeactivateEvent: function () {
    if (this.timeout) {
      me.timer.clearTimeout(this.timeout);
    }
  },

  setDashVelocity: function () {
    this.body.setVelocity(22, 30);
  },

  setMovementVelocity: function () {
    this.body.setVelocity(5, 21);
  },

  takeDamage: function () {
    if (!this.damaged && !this.dodging) {
      this.damaged = true;
      this.health -= 1;
      game.playScreen.lowerHealth();
      if(this.health <= 0) {
        this.dieCallback();
      }
      else {
        this.renderable.flicker(300, this.damagedCallback.bind(this));
      }
    }
  },

  update: function (time) {
    if(this.health > 0) {
      this.handleInput();
    }

    if (this.gliding && me.timer.getTime() - this.glideTime >= 1000) {
      this.gliding = false;
      this.renderable.setCurrentAnimation('run');
      this.setMovementVelocity();
    }

    this.body.update();
    me.collision.check(this);

    if (this.body.vel.x !== 0 || this.body.vel.y !== 0 || this.health <= 0 || this.gliding) {
      this._super(me.Entity, 'update', [time]);
    }
    else if(this.dashing) {
      this.dashing = false;
      this.setMovementVelocity();
    }
    return true;
  }
});