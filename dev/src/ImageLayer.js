/**
 * Created by Andrew on 3/27/16.
 */
class ImageLayer extends AbstractLayer {
  /**
   * @param {string[]} imageData - The list of image data
   * @param {number} width - The width of the image layer
   * @param {number} height - The height of the image layer
   */
  constructor(imageData, width, height) {
    super();

    this._imageData = imageData;
    this._width = width;
    this._height = height;

    this._images = [];
    this._viewIndex = 0;
    this._loadCount = 0;
    this._loading = null;
    this._isChanging = false;

    this._setup();
  }

  /**
   * Moves the image layer forward one image.
   */
  forward() {
    if (this._isChanging) return;
    const currentIndex = this._viewIndex;
    this._viewIndex = Math.min(++this._viewIndex, this._images.length - 1);
    this._transition(currentIndex, this._viewIndex);
  }

  /**
   * Moves the image layer back one image.
   */
  back() {
    if (this._isChanging) return;
    const currentIndex = this._viewIndex;
    this._viewIndex = Math.max(--this._viewIndex, 0);
    this._transition(currentIndex, this._viewIndex);
  }

  /**
   * Loads the images.
   *
   * @triggers ImageLayer.EVT_FULLY_LOADED - upon completed
   */
  load() {
    // Show the loading text
    this._loading.visible = true;

    // Parse the images
    /** Delay the loading for stage awareness */
    Helpers.delayer(() => {
      let index = 0;
      this._imageData.forEach((imageData) => {
        const start = Date.now();
        const img = new Image();
        img.index = index++;
        img.onload = (e) => {
          console.log(`Loaded ${img.index} image after ${Date.now() - start}ms.`, imageData);

          const imgTag = new ImageWrapper(img);
          imgTag.setSize(this._width, this._height);
          imgTag.visible = false;
          this._images[img.index] = imgTag;
          this.addChild(imgTag);

          this._loadCount++;
          if (this._loadCount === this._imageData.length) {
            // Hide the loading text
            this._loading.visible = false;

            //Show the current image
            this._images[this._viewIndex].visible = true;

            // Notify
            this.dispatchEvent(ImageLayer.EVT_FULLY_LOADED);
          }
        };
        img.onerror = (e) => {
          console.error("Failed to load image.", e);
        };
        img.src = imageData;
      });
    });
  }

  _transition(slideOutIndex, slideInIndex) {
    if (slideOutIndex === slideInIndex) return; // no change needed, same slide
    this._lock();

    const LEFT_POS = { x: -this._width };
    const CENTER_POS = { x: 0 };
    const RIGHT_POS = { x: this._width };
    const DURATION = 500;

    const goingLeft = slideInIndex > slideOutIndex;
    const outTo = (goingLeft) ? LEFT_POS : RIGHT_POS;

    const slideLeaving = this._images[slideOutIndex];
    slideLeaving.x = CENTER_POS.x; // make sure it's in the visible position
    createjs.Tween.get(slideLeaving).to(outTo, DURATION, createjs.Ease.circInOut);

    const slideEntering = this._images[slideInIndex];
    slideEntering.x = goingLeft ? RIGHT_POS.x : LEFT_POS.x;
    slideEntering.visible = true;
    createjs.Tween.get(slideEntering)
      .to(CENTER_POS, DURATION, createjs.Ease.circInOut)
      .call(() => { this._unlock(); });
  }

  _setup() {
    // Setup the loading indicator
    this._loading = new createjs.Text('Loading...', '42px Arial', '#444');
    this._loading.textAlign = 'center';
    this._loading.textBaseline = 'middle';
    this._loading.x = this._width / 2;
    this._loading.y = this._height / 2;
    this._loading.visible = false;
    this.addChild(this._loading);

    // Force the bounds to the width and height we were given so no image can draw outside of it
    this.mask = new createjs.Shape();
    this.mask.graphics.drawRect(0,0, this._width, this._height);
  }

  _lock() {
    this._isChanging = true;
    this._notifyTransition();
  }

  _unlock() {
    this._isChanging = false;
    this._notifyTransition();
  }

  _notifyTransition() {
    const data = {
      isTransitioning: this._isChanging,
      atMin: this._viewIndex === 0,
      atMax: this._viewIndex === this._images.length - 1
    };
    this.dispatchEvent(ImageLayer.EVT_TRANSITION_STATE_CHANGE, data);
  }
}
ImageLayer.EVT_FULLY_LOADED = "EVT_FULLY_LOADED";
/**
 *
 * @data {
 *   {boolean} isTransitioning - True if the image layer is currently transitioning
 *   {boolean} atMin - Is at the min image (index === 0)
 *   {boolean} atMax - Is at the max image (index === allImages.length)
 * }
 */
ImageLayer.EVT_TRANSITION_STATE_CHANGE = "EVT_TRANSITION_STATE_CHANGE";
