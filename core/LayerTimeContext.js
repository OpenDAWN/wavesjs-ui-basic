'use strict'

/**
 *  @class LayerTimeContext
 *
 *  A `LayerTimeContext` instance represent a time segment into a `TimelineTimeContext`. It must be attached to a `TimelineTimeContext` (the one of the timeline it belongs to). It relies on its parent's xScale (time to pixel transfert function) to create the time to pixel representation of the Layer (the view) it is attached to.
 *
 *  The `layerTimeContext` has four important attributes
 *  - `timeContext.start` represent the time at which temporal data must be represented in the timeline (for instance the begining of a soundfile in a DAW)
 *  - `timeContext.offset` represents offset time of the data in the context of a Layer. (@TODO give a use case example here "crop ?", and/or explain that it's not a common use case)
 *  - `timeContext.duration` is the duration of the view on the data
 *  - `timeContext.stretchRatio` is the stretch applyed to the temporal data contained in the view (this value can be seen as a local zoom on the data, or as a stretch on the time components of the data). When applyed, the stretch ratio maintain the start position of the view in the timeline.
 *
 *
 * + timeline -----------------------------------------------------------------
 * 0         5         10          15          20        25          30 seconds
 * +---+*****************+------------------------------------------+*******+--
 *     |*** soundfile ***|Layer (view on the sound file)            |*******|
 *     +*****************+------------------------------------------+*******+
 *
 *     <---- offset ----><--------------- duration ----------------->
 * <-------- start ----->
 *
 *      The parts of the sound file represented with '*' are hidden from the view
 *
 */
function LayerTimeContext(parent) {

	this.params = params;

	if (!parent) { 
		throw new Error('LayerTimeContext must have a parent'); 
	}

	this.parent = parent;

	this._xScale = null;

	this._start = 0;
	this._duration = parent.containersDuration;
	this._offset = 0;
	this._stretchRatio = 1;
	// register into the timeline's TimeContext
	this.parent._children.push(this);

	this.clone = function() {
		const ctx = new this();

		ctx.parent = this.parent;
		ctx.start = this.start;
		ctx.duration = this.duration;
		ctx.offset = this.offset;
		ctx.stretchRatio = this.stretchRatio; // creates the xScale if needed

		return ctx;
	}

	Object.defineProperties(this, {
		'start' : {
			get : function() {
				return this._start;
			},
			set : function(value) {
				this._start = value;
			}
		}, 
		'duration' : {
			get : function() {
				return this._duration;
			},
			set : function(value) {
				this._duration = value;
			}
		}, 
		'offset' : {
			get : function() {
				return this._offset;
			},
			set : function(value) {
				this._offset = value;
			}
		}, 
		'stretchRatio' : {
			get : function() {
				return this._stretchRatio;
			},
			set : function(value) {
				// remove local xScale if ratio = 1
				if (value ===  1) {
				this._xScale = null;
				return;
				}

				const xScale = this.parent.originalXScale.copy();
				const [min, max] = xScale.domain();
				const diff = (max - min) / (value * this.parent.stretchRatio);

				xScale.domain([min, min + diff]);

				this._xScale = xScale;
				this._stretchRatio = value;
			}
		}, 
		'xScale' : {
			get : function() {
				if (!this._xScale) {
					return this.parent.xScale;
				}
				return this._xScale;
			}
		}, 
		'xScaleRange' : {
			get : function() {
				return this.xScale.range();
			},
			set : function(arr) {
				if (!this._xScale) { 
					return; 
				}
				this._xScale.range(arr);
			}
		}
	});
}