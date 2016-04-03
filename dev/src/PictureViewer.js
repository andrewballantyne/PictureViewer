/**
 * Created by Andrew on 3/23/16.
 */
class PictureViewer extends createjs.Container {
  /**
   * @param {string[]} images - The list of image datas
   * @param {number} width - The width of the image layer
   * @param {number} height - The height of the image layer
   */
  constructor(images, width, height) {
    super();

    this._width = width;
    this._height = height;

    // Layers
    this._bgLayer = null;
    this._imageLayer = new ImageLayer(images, this._width, this._height);
    this._navLayer = null;

    this._setup();
    this._setupListeners();
  }

  /**
   * Move to the next picture slide. If at the max, nothing happens.
   */
  nextSlide() {
    this._imageLayer.forward();
  }

  /**
   * Move the last picture slide. If at the min, nothing happens.
   */
  prevSlide() {
    this._imageLayer.back();
  }

  _setup() {
    this._bgLayer = new BackgroundLayer(this._width, this._height);
    this.addChild(this._bgLayer);

    this._imageLayer.on(ImageLayer.EVT_FULLY_LOADED, this._imagesLoaded.bind(this));
    this._imageLayer.on(ImageLayer.EVT_TRANSITION_STATE_CHANGE, this._transitionChange.bind(this));
    this._imageLayer.load();
    this.addChild(this._imageLayer);

    this._navLayer = new NavLayer(this._width, this._height);
    this._navLayer.on(NavLayer.EVT_NAV_BACK, this.prevSlide.bind(this));
    this._navLayer.on(NavLayer.EVT_NAV_NEXT, this.nextSlide.bind(this));
    this.addChild(this._navLayer);
  }

  _imagesLoaded() {
    this._bgLayer.hide();
    this._navLayer.show();
  }

  _transitionChange(e) {
    const transitionData = e.data;
    this._navLayer.setLeftNavAvailable(!transitionData.atMin);
    this._navLayer.setRightNavAvailable(!transitionData.atMax);
  }

  _setupListeners() {
    this.on('click', (e) => {
      const stagePoint = Helpers.eventToLocalPoint(e, this);
      this._navLayer.handleClick(stagePoint);
    });
  }
}