'use strict'

function BreakpointBehavior(options) {

  BaseBehavior.call(this, options);

  this.edit = function(renderingContext, shape, datum, dx, dy, target) {
    const data  = this._layer.data;
    const layerHeight = renderingContext.height;
    // current position
    const x = renderingContext.xScale(shape.cx(datum));
    const y = renderingContext.yScale(shape.cy(datum));
    // target position
    let targetX = x + dx;
    let targetY = y - dy;

    if (data.length > 2) {
      // create a sorted map of all `x` positions
      const xMap = data.map(function(d) { renderingContext.xScale(shape.cx(d)) });
      xMap.sort(function(a, b) { return (a < b) ? -1 : 1});
      // find index of our shape x position
      const index = xMap.indexOf(x);
      // lock to next siblings
      if (targetX < xMap[index - 1] || targetX > xMap[index + 1]) {
        targetX = x;
      }
    }

    // lock in y axis
    if (targetY < 0) {
      targetY = 0;
    } else if (targetY > layerHeight) {
      targetY = layerHeight;
    }

    // update datum with new values
    shape.cx(datum, renderingContext.xScale.invert(targetX));
    shape.cy(datum, renderingContext.yScale.invert(targetY));
  }

}

BreakpointBehavior.prototype = Object.create(BaseBehavior.prototype);

BreakpointBehavior.prototype.constructor = BreakpointBehavior;