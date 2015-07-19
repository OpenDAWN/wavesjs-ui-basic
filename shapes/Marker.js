'use strict'

function Marker(options) {

  BaseShape.call(this, options);

  this.getClassName = function() { 
    return 'marker'; 
  }

  this._getAccessorList = function() {
    return { x: 0, color: '#000000' };
  }

  this._getDefaults = function() {
    return {
      handlerWidth: 7,
      handlerHeight: 10,
      displayHandler: true,
      opacity: 1
    };
  }

  this.render = function(renderingContext) {
    if (this.el) { 
      return this.el; 
    }

    const height = renderingContext.height;

    this.el = document.createElementNS(this.ns, 'g');
    this.line = document.createElementNS(this.ns, 'rect');

    // draw line
    this.line.setAttributeNS(null, 'x', 0);
    this.line.setAttributeNS(null, 'y', 0);
    this.line.setAttributeNS(null, 'width', 1);
    this.line.setAttributeNS(null, 'height', height);
    this.line.setAttributeNS(null, 'shape-rendering', 'optimizeSpeed');

    this.el.appendChild(this.line);

    if (this.params.displayHandlers) {
      this.handler = document.createElementNS(this.ns, 'rect');

      this.handler.setAttributeNS(null, 'x', -((this.params.handlerWidth - 1) / 2));
      this.handler.setAttributeNS(null, 'y', renderingContext.height - this.params.handlerHeight);
      this.handler.setAttributeNS(null, 'width', this.params.handlerWidth);
      this.handler.setAttributeNS(null, 'height', this.params.handlerHeight);
      this.handler.setAttributeNS(null, 'shape-rendering', 'crispEdges');

      this.el.appendChild(this.handler);
    }

    this.el.style.opacity = this.params.opacity;

    return this.el;
  }

  this.update = function(renderingContext, group, datum, index) {
    const x = renderingContext.xScale(this.x(datum)) - 0.5;
    const color = this.color(datum);

    group.setAttributeNS(null, 'transform', "translate(" + x + ", 0)");

    this.line.style.fill = color;

    if (this.params.displayHandlers) {
      this.handler.style.fill = color;
    }
  }

  this.inArea = function(renderingContext, datum, x1, y1, x2, y2) {
    // handlers only are selectable
    const x = renderingContext.xScale(this.x(datum));
    const shapeX1 = x - (this.params.handlerWidth - 1) / 2;
    const shapeX2 = shapeX1 + this.params.handlerWidth;
    const shapeY1 = renderingContext.height - this.params.handlerHeight;
    const shapeY2 = renderingContext.height;

    const xOverlap = Math.max(0, Math.min(x2, shapeX2) - Math.max(x1, shapeX1));
    const yOverlap = Math.max(0, Math.min(y2, shapeY2) - Math.max(y1, shapeY1));
    const area = xOverlap * yOverlap;

    return area > 0;
  }
}

Marker.prototype = Object.create(BaseShape.prototype);

Marker.prototype.constructor = Marker;