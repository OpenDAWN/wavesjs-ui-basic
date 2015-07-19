'use strict'

function Dot(options) {

  BaseShape.call(this, options);
  
  this.getClassName = function() { 
    return 'dot'; 
  }

  // @TODO rename : confusion between accessors and meta-accessors
  this._getAccessorList = function() {
    return { cx: 0, cy: 0, r: 3, color: '#000000' };
  }

  this.render = function() {
    if (this.el) { 
      return this.el; 
    }

    this.el = document.createElementNS(this.ns, 'circle');

    return this.el;
  }

  this.update = function(renderingContext, group, datum, index) {
    const cx = renderingContext.xScale(this.cx(datum));
    const cy = renderingContext.yScale(this.cy(datum));
    const r  = this.r(datum);
    const color = this.color(datum);

    group.setAttributeNS(null, "transform", "translate(" + cx + ", " + cy + ")");
    this.el.setAttributeNS(null, 'r', r);
    this.el.style.fill = color;
  }

  // x1, x2, y1, y2 => in pixel domain
  this.inArea = function(renderingContext, datum, x1, y1, x2, y2) {
    const cx = renderingContext.xScale(this.cx(datum));
    const cy = renderingContext.yScale(this.cy(datum));

    if ((cx > x1 && cx < x2) && (cy > y1 && cy < y2)) {
      return true;
    }

    return false;
  }

}

Dot.prototype = Object.create(BaseShape.prototype);

Dot.prototype.constructor = Dot;