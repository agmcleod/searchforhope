game.dash = {
  dash: function(entity) {
    entity.dashing = true;
    var mousePos = me.game.viewport.localToWorld(me.input.mouse.pos.x, me.input.mouse.pos.y);
    entity.direction.set((mousePos.x - entity.pos.x), (mousePos.y - entity.pos.y));
    entity.direction.normalize();
    entity.direction.scaleV(entity.dashVel);

    entity.renderable.setCurrentAnimation('dash');
    entity.vel.add(entity.direction);
  }
}