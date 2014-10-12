game.chaseBehaviour = {
  execute: function (entity, target) {
    var diff = entity.pos.x - target.x;
    if (diff > entity.maxChase || diff < -entity.maxChase) {
      return;
    }
    if (entity.pos.x > target.x) {
      entity.renderable.flipX(false);
      entity.body.vel.x -= entity.body.accel.x * me.timer.tick;
    }
    else if (entity.pos.x < target.x) {
      entity.renderable.flipX(true);
      entity.body.vel.x += entity.body.accel.x * me.timer.tick;
    }
  }
};