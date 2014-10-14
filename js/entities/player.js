game.Player = me.Entity.extend({
  init: function(x, y, settings) {
    settings.width = 32;
    settings.height = 32;
    this._super(me.Entity, "init", [x, y, settings]);
    this.body.setShape(2, 0, 24, 32);
    this.body.setVelocity(5, 21);
    this.body.setFriction(1.5, 0);
    this.body.collisionType = me.collision.types.PLAYER_OBJECT;
    console.log(game.atlas.getRegion("player.png"));
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
    this.dashVel = new me.Vector2d(30, 20);

    this.renderable.addAnimation('dash', [0], 1);
    this.renderable.addAnimation('run', [1,2,3,4,5,6,7,8,9], 20);
    this.renderable.setCurrentAnimation('run');
  },

  damagedCallback: function() {
    this.damaged = false;
  },

  draw: function(context) {
    this._super(me.Entity, 'draw', [context]);
    if(this.damaged) {
      game.playScreen.uiFont.draw(context.getContext(), this.health, this.pos.x - 10, this.pos.y - 10);
    }
    if(game.playScreen.drawMessageOne) {
      var image = me.loader.getImage('messageone');
      context.drawImage(image, this.pos.x + this.width, this.pos.y - image.height);
    }
    else if(game.playScreen.drawMessageTwo) {
      var image = me.loader.getImage('messagetwo');
      context.drawImage(image, this.pos.x + this.width, this.pos.y - image.height);
    }
  },

  handleInput: function() {
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

    if (this.body.vel.x === 0 && !this.renderable.isCurrentAnimation("dash")) {
      this.renderable.setCurrentAnimation("dash");
    }

    if (me.input.isKeyPressed('jump')) {
      this.jumping = true;

      this.jumpState = (this.body.vel.y === 0)?1:this.jumpState;

      if (this.jumpState <= 1) {
        this.body.vel.y -= (this.body.maxVel.y * this.jumpState++) * me.timer.tick;
      }
    }

    /* if (me.input.isKeyPressed('dash') && !this.dashing && !this.body.falling) {
      game.dash.dash(this);
      this.body.setMaxVelocity(100, 50);
      if(this.direction.x < 0) {
        this.flipX(true);
      }
      else {
        this.flipX(false);
      }
    } */
  },

  movementSetup: function() {
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
            this.renderable.flicker(300, function() {
              me.levelDirector.loadLevel.defer(this, 'intro');
            });
          }
          else {
            this.renderable.flicker(300, this.damagedCallback.bind(this));
          }

        }

        return false;
        break;
      default:
        return true;


    };
  },

  setDefaultAnimation: function() {
    this.renderable.setCurrentAnimation('run');
  },

  update: function(time) {
    this.handleInput();
    /* if (Object.keys(this.renderable.anim).length === 1) {
      this.renderable.addAnimation('dash', [0], 1);
      this.renderable.addAnimation('run', [1,2,3,4,5,6,7,8,9], 20);
      this.renderable.setCurrentAnimation('run');
    } */

    this.body.update();
    me.collision.check(this);

    if (this.body.vel.x !== 0 || this.body.vel.y !== 0) {
      this._super(me.Entity, 'update', [time]);
    }
    else {
      this.dashing = false;
    }
    return true;
  }
});