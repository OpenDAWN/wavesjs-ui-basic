'use strict'

/**
*  @class TimelineTimeContext
*
*  A TimelineTimeContext instance represents the mapping between the time and the pixel domains
*
*  The `timelineTimeContext` has 3 important attributes:
*  - `timeContext.xScale` which defines the time to pixel transfert function, itself defined by the `pixelsPerSecond` attribute of the timeline
*  - `timeContext.offset` defines a decay (in time domain) applied to all the views on the timeline. This allow to navigate inside durations longer than what can be represented in Layers (views) containers (e.g. horizontal scroll)
*  - `timeContext.stretchRatio` defines the zoom factor applyed to the timeline
*
*  It owns an helper `timeContext.containersDuration` which maintain a view on how much time the views applyed to the timeline (the `containers`) are representing
*
*  It also maintain an array of references to all the LayerTimeContext attached to the timeline to propagate some global change on the time to pixel representation
*/
function TimelineTimeContext() {

	this.params = params;
	this._children = [];

	this._xScale = null;
	this._originalXScale = null;

	// params
	this._containersDuration = 1; // for layers inheritance only
	this._offset = 0;
	this._stretchRatio = 1;

	Object.defineProperties(this, {
		'containersDuration' : {
			get: function() { 
				return this._containersDuration; 
			}, 
			set: function(value) { 
				this._containersDuration = value; 
			}
		},
		'offset' : {
			get: function() {
				return this._offset;
			}, 
			set: function(value) {
				this._offset = value;
			}
		}, 
		'stretchRatio' : {
			get: function() {
				return this._stretchRatio;
			}, 
			set: function(value) {
				const xScale = this.originalXScale.copy();
				const domain = xScale.domain();
				const min = domain[0];
				const max = domain[1];
				const diff = (max - min) / value;

				xScale.domain([min, min + diff]);

				this._xScale = xScale;
				this._stretchRatio = value;

				// Propagate change to children who have their own xScale
				const ratioChange = value / (this._stretchRatio);

				this._children.forEach(function(child) {
					if (!child._xScale) { 
						return; 
					}
					child.stretchRatio = child.stretchRatio * ratioChange;
				});
			}
		}, 
		'xScale' : {
			get: function() {
				return this._xScale;
			}, 
			set: function(value) {
				this._xScale = scale;

				if (!this._originalXScale) {
					this._originalXScale = this._xScale.copy();
				}
			}
		}, 
		'xScaleRange' : {
			get: function() {
				return this._xScale.range();
			}, 
			set: function(arr) {
				this._xScale.range(arr);
				this._originalXScale.range(arr);
				// propagate to children
				this._children.forEach( function(child){
					child.xScaleRange = arr;
				});
			}
		},
		'originalXScale' : {
			get: function() {
				return this._originalXScale;
			}, 
			set: function(value) {
				this._originalXScale = scale;
			}
		}
	})
}