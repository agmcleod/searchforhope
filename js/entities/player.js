game.Player = me.ObjectEntity.extend({
  init: function(x, y, settings) {
    this._super(me.ObjectEntity, "init", [x, y, settings]);
    this.setVelocity(3, 20);
    this.getShape().resize(28, 32);
    this.getShape().translate(2, 0);
    this.renderable.addAnimation('dash', [0], 1);
    this.renderable.addAnimation('run', [1,2,3,4,5,6,7,8,9], 20);
    this.renderable.setCurrentAnimation('run');
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    this.health = 3;
    this.dashing = false;
    this.direction = new me.Vector2d();
    this.dashVel = new me.Vector2d(300, 50);
    this.distanceTravelled = new me.Vector2d();
    this.setFriction(10, 0);
  },

  damagedCallback: function() {
    this.damaged = false;
  },

  handleInput: function() {
    if (me.input.isKeyPressed('left')) {
      this.flipX(true);
      this.vel.x -= this.accel.x * me.timer.tick;
    }
    else if (me.input.isKeyPressed('right')) {
      this.flipX(false);
      this.vel.x += this.accel.x * me.timer.tick;
    }
    else if(!this.dashing) {
      this.vel.x = 0;
    }

    if (me.input.isKeyPressed('jump') && !this.jumping && !this.falling) {
      this.vel.y = -this.maxVel.y * me.timer.tick;
      this.jumping = true;
    }

    if (me.input.isKeyPressed('dash') && !this.dashing && !this.falling) {
      game.dash.init(this);
    }
  },

  moveByVelocity: function() {
    this.computeVelocity(this.vel);

    // Adjust position only on collidable object
    var collision;
    // save the collision box offset
    this._bounds = this.getBounds(this._bounds);
    this.__offsetX = this._bounds.pos.x;
    this.__offsetY = this._bounds.pos.y;
    this._bounds.translateV(this.pos);

    // check for collision
    collision = this.collisionMap.checkCollision(this._bounds, this.vel);

    // update some flags
    this.onslope  = collision.yprop.isSlope || collision.xprop.isSlope;
    // clear the ladder flag
    this.onladder = false;
    var prop = collision.yprop;
    var tile = collision.ytile;

    // y collision
    if (collision.y) {
      // going down, collision with the floor
      this.onladder = prop.isLadder || prop.isTopLadder;

      if (collision.y > 0) {
        if (prop.isSolid || (prop.isPlatform && (this._bounds.bottom - 1 <= tile.pos.y))) {
          // adjust position to the corresponding tile
          this._bounds.pos.y = ~~this._bounds.pos.y;
          this.vel.y = 0;
          this.falling = false;
        }
        else if (prop.isSlope && !this.jumping) {
          // we stop falling
          this.checkSlope(
            this._bounds,
            tile,
            prop.isLeftSlope
          );
          this.falling = false;
        }
      }
      // going up, collision with ceiling
      else if (collision.y < 0) {
        if (!prop.isPlatform && !prop.isLadder && !prop.isTopLadder) {
          if (this.gravity) {
              this.falling = true;
          }
          // cancel the y velocity
          this.vel.y = 0;
        }
      }
    }
    prop = collision.xprop;
    tile = collision.xtile;

    // x collision
    if (collision.x) {
      if (prop.isSlope && !this.jumping) {
        this.checkSlope(this._bounds, tile, prop.isLeftSlope);
        this.falling = false;
      }
      else {
        // can walk through the platform
        if (!prop.isPlatform) {
          this.vel.x = 0;
        }
      }
    }

    this.pos.set(
      this._bounds.pos.x - this.__offsetX,
      this._bounds.pos.y - this.__offsetY
    );

    // update player position
    this.pos.add(this.vel);
  },

  setDefaultAnimation: function() {
    this.renderable.setCurrentAnimation('run');
  },

  update: function(time) {
    this.handleInput();

    var res = me.game.world.collide(this);

    if (res) {
      if (res.obj.type === me.game.ENEMY_OBJECT) {
        if (!this.dashing && !this.damaged) {
          this.damaged = true;
          this.health -= 1;
          if(this.health <= 0) {
            me.levelDirector.reloadLevel.defer();
          }
          else {
            this.renderable.flicker(400, this.damagedCallback.bind(this));
          }
        }
      }
      else {
        this.dashing = false;
        this.setDefaultAnimation();
      }  
    }
    

    if (this.dashing) {
      //game.dash.move(this);
      //this.moveByVelocity();
    }
    //else {
      this.updateMovement();
    //}
    
    if (this.vel.x !== 0 || this.vel.y !== 0) {
      this._super(me.ObjectEntity, 'update', [time]);
      return true;
    }
    else {
      return false;
    }
  }
});