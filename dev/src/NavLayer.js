/**
 * Created by Andrew on 3/27/16.
 */
class NavLayer extends AbstractLayer {
  /**
   * @param {number} width - The width of the nav layer
   * @param {number} height - The height of the nav layer
   */
  constructor(width, height) {
    super();

    this._width = width;
    this._height = height;

    this._CLICK_ZONE_WIDTH = 100;
    this._mouseDisabled = true;
    this._leftNav = null;
    this._rightNav = null;

    this._setup();
  }

  /**
   * @override
   * Shows the layer and enables the navigation.
   */
  show() {
    super.show();
    this._mouseDisabled = false;
  }

  /**
   * @override
   * Hides the layer and disables the navigation.
   */
  hide() {
    super.hide();
    this._mouseDisabled = true;
  }

  /**
   * Handle a click event.
   *
   * @param parentPoint {{x:number, y:number}} - The point, relative to the parent's location
   */
  handleClick(parentPoint) {
    if (this._mouseDisabled) return;
    const point = Helpers.pointToLocalPoint(parentPoint, this); // convert to local
    if (point.x < this._CLICK_ZONE_WIDTH) {
      // Left click
      this.dispatchEvent(NavLayer.EVT_NAV_BACK);
      console.log("<<");
    } else if (point.x > this._width - this._CLICK_ZONE_WIDTH) {
      // Right click
      this.dispatchEvent(NavLayer.EVT_NAV_NEXT);
      console.log(">>");
    }
  }

  setLeftNavAvailable(isAvailable) {
    this._leftNav.visible = isAvailable;
  }

  setRightNavAvailable(isAvailable) {
    this._rightNav.visible = isAvailable;
  }

  _setup() {
    this.hide();

    const colors = ['rgba(0,0,0,1)', 'rgba(0,0,0,0)'];
    const colorStops = [1, 0];
    const defaultAlpha = .5;

    this._leftNav = new createjs.Shape();
    this._leftNav.alpha = defaultAlpha;
    this._leftNav.graphics
      .beginLinearGradientFill(
        colors,
        colorStops,
        this._CLICK_ZONE_WIDTH, 0,
        0, 0
      )
      .drawRect(0, 0, this._CLICK_ZONE_WIDTH, this._height)
    ;
    this.addChild(this._leftNav);

    this._rightNav = new createjs.Shape();
    this._rightNav.alpha = defaultAlpha;
    this._rightNav.graphics
      .beginLinearGradientFill(
        colors,
        colorStops,
        this._width - this._CLICK_ZONE_WIDTH, 0,
        this._width, 0
      )
      .drawRect(this._width - this._CLICK_ZONE_WIDTH, 0, this._CLICK_ZONE_WIDTH, this._height)
    ;
    this.addChild(this._rightNav);
  }
}
NavLayer.EVT_NAV_BACK = "EVT_NAV_BACK";
NavLayer.EVT_NAV_NEXT = "EVT_NAV_NEXT";
