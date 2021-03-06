'use strict'

// @NOTE: accessors should receive datum index as argument
// to allow the use of sampleRate to define x position
function BaseShape (options) {

  if (!options)
    options = {};

  this.el = null;
  this.ns = 'http://www.w3.org/2000/svg';
  this.params = Object.assign({}, this._getDefaults(), options);
  // create accessors methods and set default accessor functions
  const accessors = this._getAccessorList();
  this._createAccessors(accessors);
  this._setDefaultAccessors(accessors);

}


BaseShape.prototype._getDefaults = function() {
  return {};
}


/**
 *  clean references, is called from the `layer`
 */
BaseShape.prototype.destroy = function() {
  // this.group = null;
  this.el = null;
}


/**
 * @return {String} the name of the shape, used as a class in the element group
 */
BaseShape.prototype.getClassName = function() { 
  return 'shape'; 
}


// should only be called once
// setSvgDefinition(defs) {}


/**
 * @TODO rename
 * @return {Object}
 *    keys are the accessors methods names to create
 *    values are the default values for each given accessor
 */
BaseShape.prototype._getAccessorList = function() { 
  return {}; 
}


/**
 *  install the given accessors on the shape
 */
BaseShape.prototype.install = function(accessors) {
  for (var key in accessors) { 
    this[key] = accessors[key]; 
  }
}


/**
 * generic method to create accessors
 * adds accessor to the prototype if not already present
 */
BaseShape.prototype._createAccessors = function(accessors) {
  this._accessors = {};
  // add it to the prototype
  const proto = Object.getPrototypeOf(this);
  // create a getter / setter for each accessors
  // setter : `this.x = callback`
  // getter : `this.x(datum)`
  Object.keys(accessors).forEach(function(name) {
    if (proto.hasOwnProperty(name)) { 
      return; 
    }

    Object.defineProperty(proto, name, {
      get: function() { 
        return this._accessors[name]; 
      },
      set: function(func) {
        this._accessors[name] = func;
      }
    });
  });
}


/**
 * create a function to be used as a default
 * accessor for each accesors
 */
BaseShape.prototype._setDefaultAccessors = function(accessors) {
  var _this = this;

  Object.keys(accessors).forEach(function(name) {
    const defaultValue = accessors[name];
    let accessor = function(d) {

      const v = arguments[1] === undefined ? null : arguments[1];

      if (v === null) { 
        return d[name] || defaultValue; 
      }
      
      d[name] = v;
    };
    // set accessor as the default one
    _this[name] = accessor;
  });
}


/**
 * @param  renderingContext {Context} the renderingContext the layer which owns this item
 * @return  {DOMElement} the DOM element to insert in the item's group
 */
BaseShape.prototype.render = function(renderingContext) {}


/**
 * @param  group {DOMElement} group of the item in which the shape is drawn
 * @param  renderingContext {Context} the renderingContext the layer which owns this item
 * @param
 *    simpleShape : datum {Object} the datum related to this item's group
 *    commonShape : datum {Array} the associated to the Layer
 * @param
 *    simpleShape : index {Number} the current index of the datum
 *    commonShape : undefined
 * @return  void
 */
BaseShape.prototype.update = function(renderingContext, group, datum, index) {}


/**
 *  define if the shape is considered to be the given area
 *  arguments are passed in domain unit (time, whatever)
 *  @return {Boolean}
 */
BaseShape.prototype.inArea = function(renderingContext, datum, x1, y1, x2, y2) {}