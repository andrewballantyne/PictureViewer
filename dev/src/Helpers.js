/**
 * Created by Andrew on 3/26/16.
 */
const Helpers = (new class _Helpers {
  constructor() {
    this._allowDelay = true;
  }

  delayer(callback, duration = 1000) {
    if (!this._allowDelay) return;

    console.log(`Delaying functionality for ${duration}ms`);
    setTimeout(callback, duration);
  }

  lazyDelayer(...args) {
    return () => {
      this.delayer.apply(this, args);
    };
  }

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

  eventToLocalPoint(e, displayObject) {
    const stagePoint = this.eventToPoint(e);

    return {
      x: stagePoint.x - displayObject.x,
      y: stagePoint.y - displayObject.y
    }
  }
});