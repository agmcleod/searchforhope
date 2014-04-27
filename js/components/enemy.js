game.enemy = {
  onCollision: function(enemy, res, obj) {
    if (enemy.alive) {
      enemy.renderable.flicker(300, function() {
        me.game.world.removeChild(enemy);
      });
    }
  }
}