game.Enemy = {
  onCollision: function(enemy, res, obj) {
    if (enemy.alive && obj.dashing) {
      obj.renderable.flicker(750);
    }
  }
}