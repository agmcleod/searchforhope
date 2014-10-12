game.patrolBehaviour = {
  execute: function (entity) {
    if (entity.pos.x >= entity.endpatrol) {
      entity.direction = -1;
      entity.renderable.flipX(false);
    }
    else if (entity.pos.x <= entity.startpatrol) {
      entity.direction = 1;
      entity.renderable.flipX(true);
    }
    if (entity.direction > 0) {
      entity.body.vel.x += entity.body.accel.x * me.timer.tick;
    }
    else {
      entity.body.vel.x -= entity.body.accel.x * me.timer.tick;
    }
  }
};