'use strict'

function TimeContextBehavior() {}

TimeContextBehavior.prototype.edit = function(layer, dx, dy, target) {
  const timeContext = layer.timeContext;

  if (target.classList.contains('handler') && target.classList.contains('left')) {
    this._editLeft(timeContext, dx);
  } else if (target.classList.contains('handler') && target.classList.contains('right')) {
    this._editRight(timeContext, dx);
  } else if (target.classList.contains('segment')) {
    this._move(timeContext, dx);
  }
}

TimeContextBehavior.prototype._editLeft = function(timeContext, dx) {
  // edit `start`, `offset` and `duration`
  const x = timeContext.parent.xScale(timeContext.start);
  const offset = timeContext.xScale(timeContext.offset);
  const width = timeContext.xScale(timeContext.duration);

  const targetX = x + dx;
  const targetOffset = offset - dx;
  const targetWidth = Math.max(width - dx, 1);

  timeContext.start = timeContext.parent.xScale.invert(targetX);
  timeContext.offset = timeContext.xScale.invert(targetOffset);
  timeContext.duration = timeContext.xScale.invert(targetWidth);
}

TimeContextBehavior.prototype._editRight = function(timeContext, dx) {
  const width = timeContext.xScale(timeContext.duration);
  const targetWidth = Math.max(width + dx, 1);

  timeContext.duration = timeContext.xScale.invert(targetWidth);
}

TimeContextBehavior.prototype._move = function(timeContext, dx) {
  const x = timeContext.parent.xScale(timeContext.start);
  const targetX = Math.max(x + dx, 0);

  timeContext.start = timeContext.parent.xScale.invert(targetX);
}

TimeContextBehavior.prototype.stretch = function(layer, dx, dy, target) {
  const timeContext = layer.timeContext;
  const lastDuration = timeContext.duration;
  const lastOffset = timeContext.offset;

  this.edit(layer, dx, dy, target);

  const newDuration = timeContext.duration;
  const ratio = (newDuration / lastDuration);

  timeContext.stretchRatio *= ratio;
  timeContext.offset = lastOffset;
  timeContext.duration = lastDuration;
}