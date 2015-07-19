'use strict'

function TraceBehavior(options) {

  BaseBehavior.call(this, options);

  this.edit = function(renderingContext, shape, datum, dx, dy, target) {
    if (target === shape.mean) {
      this._editMean(renderingContext, shape, datum, dx, dy);
    } else if (target === shape.min) {
      this._editRange(renderingContext, shape, datum, dx, dy, 'min');
    } else if (target === shape.max) {
      this._editRange(renderingContext, shape, datum, dx, dy, 'max');
    }
  }

  this._editMean = function(renderingContext, shape, datum, dx, dy) {
    // work in pixel domain
    const x = renderingContext.xScale(shape.x(datum));
    const y = renderingContext.yScale(shape.yMean(datum));

    let targetX = x + dx;
    let targetY = y - dy;

    shape.x(datum, renderingContext.xScale.invert(targetX));
    shape.yMean(datum, renderingContext.yScale.invert(targetY));
  }

  this._editRange = function(renderingContext, shape, datum, dx, dy, rangeSide) {
    const range = renderingContext.yScale(shape.yRange(datum));

    let targetRange = (rangeSide === 'min') ? range + 2 * dy : range - 2 * dy;
    targetRange = Math.max(targetRange, 0);

    shape.yRange(datum, renderingContext.yScale.invert(targetRange));
  }
}


SegmentBehavior.prototype = Object.create(BaseBehavior.prototype);

SegmentBehavior.prototype.constructor = SegmentBehavior;