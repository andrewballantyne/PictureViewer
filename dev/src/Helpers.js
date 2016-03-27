/**
 * Created by Andrew on 3/26/16.
 */
const Helpers = (new class _Helpers {
  constructor() {
    this._allowDelay = true;
  }

  /**
   * Delays a callback function by a duration.
   *
   * @param {Function} callback - A callback to call after the duration
   * @param {number?} duration - Defaults to 1000ms. How long to wait before triggering
   */
  delayer(callback, duration = 1000) {
    if (!this._allowDelay) return;

    console.log(`Delaying functionality for ${duration}ms`);
    setTimeout(callback, duration);
  }

  /**
   * Like delayer, but returns a wrapper function to allow lazy triggering. Ideal for passing as a
   * callback to an event.
   * @see delayer
   *
   * @param args - The same args as delayer
   * @returns {function()} - A wrapper function for the delayer
   */
  lazyDelayer(...args) {
    return () => {
      this.delayer.apply(this, args);
    };
  }

  /**
   * Extracts a simple x/y point out of an event object.
   *
   * @param {*|Event|{stageX:number, stageY:number, rawX:number, rawY:number}} e - A click event
   * @returns {{x:number, y:number}} - A point out of the event
   */
  eventToPoint(e) {
    let x = 0;
    let y = 0;

    // createjs event.stageXY
    x = x || e.stageX || x;
    y = y || e.stageY || y;

    // createjs event.rawXY
    x = x || e.rawX || x;
    y = y || e.rawY || y;

    // others??
    // TODO: Add support for standard non-createjs clicks

    return { x, y };
  }

  /**
   * Converts an event into a local point.
   *
   * @param {Event} e - A click event
   * @param {Object} boundingBoxObject - A bounding box obj that contains an 'x' and 'y' prop
   * @returns {{x:number, y:number}} - A point out of the event
   */
  eventToLocalPoint(e, boundingBoxObject) {
    const stagePoint = this.eventToPoint(e);

    return this.pointToLocalPoint(stagePoint, boundingBoxObject);
  }

  /**
   * Converts a point to a local point based on the provided bounding box object.
   *
   * @param {{x:number, y:number}} point - An initial point
   * @param {Object} boundingBoxObject - A bounding box obj that contains an 'x' and 'y' prop
   * @returns {{x:number, y:number}} - A point out of the event
   */
  pointToLocalPoint(point, boundingBoxObject) {
    return {
      x: point.x - boundingBoxObject.x,
      y: point.y - boundingBoxObject.y
    }
  }
});