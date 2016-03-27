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

    this._setup();
  }

  /**
   * Moves the image layer forward one image.
   */
  forward() {
    this._hideCurrentSlide();
    this._viewIndex = Math.min(++this._viewIndex, this._images.length - 1);
    this._showCurrentSlide();
  }

  /**
   * Moves the image layer back one image.
   */
  back() {
    this._hideCurrentSlide();
    this._viewIndex = Math.max(--this._viewIndex, 0);
    this._showCurrentSlide();
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
        const img = new Image();
        img.index = index++;
        img.onload = (e) => {
          console.log(`Loaded ${img.index} image.`, imageData);

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

  _hideCurrentSlide() {
    this._images[this._viewIndex].visible = false;
  }

  _showCurrentSlide() {
    this._images[this._viewIndex].visible = true;
  }

  _setup() {
    this._loading = new createjs.Text('Loading...', '42px Arial', '#444');
    this._loading.textAlign = 'center';
    this._loading.textBaseline = 'middle';
    this._loading.x = this._width / 2;
    this._loading.y = this._height / 2;
    this._loading.visible = false;
    this.addChild(this._loading);
  }
}
ImageLayer.EVT_FULLY_LOADED = "EVT_FULLY_LOADED";
