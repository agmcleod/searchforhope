game.enemy = {
  onCollision: function (enemy, res, obj) {
    if (obj.body.collisionType === me.collision.types.PLAYER_OBJECT && enemy.alive) {
      enemy.renderable.flicker(300, function() {
        me.game.world.removeChild(enemy);
      });
      return false;
    }
    else {
      return true;
    }
  },

  patrol: function (enemy) {
    if (enemy.pos.x >= enemy.endpatrol) {
      enemy.direction = -1;
      enemy.renderable.flipX(false);
    }
    else if (enemy.pos.x <= enemy.startpatrol) {
      enemy.direction = 1;
      enemy.renderable.flipX(true);
    }
    if (enemy.direction > 0) {
      enemy.body.vel.x += enemy.body.accel.x * me.timer.tick;
    }
    else {
      enemy.body.vel.x -= enemy.body.accel.x * me.timer.tick;
    }
  }
}