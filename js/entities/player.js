game.Player = me.ObjectEntity.extend({
  init: function(x, y, settings) {
    this._super(me.ObjectEntity, "init", [x, y, settings]);
    this.setVel();
    this.getShape().resize(22, 32);
    this.getShape().translate(2, 0);
    this.renderable = new me.AnimationSheet(0, 0, {
      image: me.loader.getImage(settings.image),
      spritewidth: settings.spritewidth,
      spriteheight: settings.spriteheight
    });
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    this.health = game.playScreen.playerHealth;
    this.dashing = false;
    this.direction = new me.Vector2d();
    this.dashVel = new me.Vector2d(30, 20);
    this.setFriction(1.5, 0);

    this.renderable.addAnimation('dash', [0], 1);
    this.renderable.addAnimation('run', [1,2,3,4,5,6,7,8,9], 20);
    this.renderable.setCurrentAnimation('run');
  },

  damagedCallback: function() {
    this.damaged = false;
  },

  draw: function(context) {
    this._super(me.ObjectEntity, 'draw', [context]);
    if(this.damaged) {
      game.playScreen.uiFont.draw(context, this.health, this.pos.x - 10, this.pos.y - 10);
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
      this.flipX(true);
      this.vel.x -= this.accel.x * me.timer.tick;
      this.movementSetup();
    }
    else if (me.input.isKeyPressed('right')) {
      this.flipX(false);
      this.vel.x += this.accel.x * me.timer.tick;
      this.movementSetup();
    }

    if (me.input.isKeyPressed('jump') && !this.jumping && !this.falling) {
      this.vel.y = -this.maxVel.y * me.timer.tick;
      this.jumping = true;
    }

    if (me.input.isKeyPressed('dash') && !this.dashing && !this.falling) {
      game.dash.dash(this);
      this.setMaxVelocity(100, 50);
      if(this.direction.x < 0) {
        this.flipX(true);
      }
      else {
        this.flipX(false);
      }
    }
  },

  movementSetup: function() {
    this.setVel();
    if(!this.renderable.isCurrentAnimation('run')) {
      this.renderable.setCurrentAnimation('run');
    }
  },

  setDefaultAnimation: function() {
    this.renderable.setCurrentAnimation('run');
  },

  setVel: function() {
    this.setVelocity(5, 21);
  },

  update: function(time) {
    this.handleInput();
    /* if (Object.keys(this.renderable.anim).length === 1) {
      this.renderable.addAnimation('dash', [0], 1);
      this.renderable.addAnimation('run', [1,2,3,4,5,6,7,8,9], 20);
      this.renderable.setCurrentAnimation('run');
    } */
    var res = me.game.world.collide(this);

    if (res) {
      if (res.obj.type === me.game.ENEMY_OBJECT) {
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
      }
      else {
        this.dashing = false;
        this.setDefaultAnimation();
      }  
    }

    this.updateMovement();
    
    if (this.vel.x !== 0 || this.vel.y !== 0) {
      this._super(me.ObjectEntity, 'update', [time]);
    }
    else {
      this.dashing = false;
    }
    return true;
  }
});