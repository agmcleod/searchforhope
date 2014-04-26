game.math = {
  getYIntercept: function(p1, slope) {
    return p1.y - slope * p1.x;
  },

  slope: function(p1, p2) {
    return (p2.y - p1.y) / (p2.x - p1.x);
  },

  xFromSlope: function(y, slope, b) {
    return (y - b) / slope;
  },

  yFromSlope: function(x, slope, b) {
    return slope * x + b;
  }
};