game.chaseBehaviour = {
  execute: function (entity, target) {
    var diff = Math.abs(entity.pos.x - target.x);
    var accelx = entity.body.accel.x * me.timer.tick;
    if (diff > entity.maxChase || diff <= accelx + entity.stopDiff) {
      return;
    }
    if (entity.pos.x > target.x) {
      entity.renderable.flipX(false);
      entity.body.vel.x -= accelx;
    }
    else if (entity.pos.x < target.x) {
      entity.renderable.flipX(true);
      entity.body.vel.x += accelx;
    }
  }
};