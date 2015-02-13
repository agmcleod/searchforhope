game.enemy = {
  onCollision: function (enemy, res, obj) {
    if (obj.body.collisionType === me.collision.types.PLAYER_OBJECT && enemy.alive && !other.dodging) {
      enemy.dead = true;
      enemy.renderable.flicker(300, function() {
        me.game.world.removeChild(enemy);
      });
      return false;
    }
    else if (obj.body.collisionType === me.collision.types.ENEMY_OBJECT) {
      return false;
    }
    else {
      return true;
    }
  }
}