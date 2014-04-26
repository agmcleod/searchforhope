game.dash = {
  init: function(entity) {
    entity.dashing = true;
    var mousePos = me.game.viewport.localToWorld(me.input.mouse.pos.x, me.input.mouse.pos.y);
    // v = p2 - p1; v = v:normalize() * min( v:len(), maxlength )
    entity.direction.set((mousePos.x - entity.pos.x), (mousePos.y - entity.pos.y));
    entity.direction.normalize();
    entity.direction.scaleV(entity.dashVel);

    entity.renderable.setCurrentAnimation('dash');
    entity.vel.add(entity.direction);
    //entity.distanceTravelled.set(0, 0);
  },

  move: function(entity) {
    entity.vel.add(entity.direction);
    //entity.distanceTravelled.add(entity.direction);
    // if(entity.distanceTravelled.x > 300 || entity.distanceTravelled.x < -300 || entity.distanceTravelled.y > 50 || entity.distanceTravelled.y < -50) {
    //   entity.dashing = false;
    //   this.falling = true;
    //   entity.setDefaultAnimation();
    // }
  }
}