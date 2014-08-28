game.enemy = {
  onCollision: function (enemy, res, obj) {
    if (enemy.alive) {
      enemy.renderable.flicker(300, function() {
        me.game.world.removeChild(enemy);
      });
    }
  },

  patrol: function (enemy) {
    if (enemy.pos.x >= enemy.endpatrol) {
      enemy.direction = -1;
      enemy.flipX(false);
    }
    else if (enemy.pos.x <= enemy.startpatrol) {
      enemy.direction = 1;
      enemy.flipX(true);
    }
    if (enemy.direction > 0) {
      enemy.body.vel.x += enemy.body.accel.x * me.timer.tick;
    }
    else {
      enemy.body.vel.x -= enemy.body.accel.x * me.timer.tick;
    }
  }
}