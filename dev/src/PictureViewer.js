/**
 * Created by Andrew on 3/23/16.
 */
class PictureViewer extends createjs.Container {
  constructor(images, width, height) {
    super();

    this._width = width;
    this._height = height;
    this._imageData = images;

    this._CLICK_ZONE_WIDTH = 50;
    this._viewIndex = 0;
    this._images = [];
    this._bg = null;
    this._loading = null;
    this._imgContainer = null;
    this._navPanels = null;
    this._clickDisabled = true;
    this._loadCount = 0;

    this._setupData();
    this._setupInterface();
  }

  nextSlide() {
    this._hideCurrentSlide();
    this._viewIndex = Math.min(++this._viewIndex, this._images.length - 1);
    this._showCurrentSlide();
  }

  prevSlide() {
    this._hideCurrentSlide();
    this._viewIndex = Math.max(--this._viewIndex, 0);
    this._showCurrentSlide();
  }

  _hideCurrentSlide() {
    this._images[this._viewIndex].visible = false;
  }

  _showCurrentSlide() {
    this._images[this._viewIndex].visible = true;
  }

  _setupData() {
    this._bg = new createjs.Shape();
    this._bg.graphics.beginFill('#ccc').drawRect(0, 0, this._width, this._height);
    this.addChild(this._bg);

    this._loading = new createjs.Text('Loading...', '42px Arial', '#444');
    this._loading.textAlign = 'center';
    this._loading.textBaseline = 'middle';
    this._loading.x = this._width / 2;
    this._loading.y = this._height / 2;
    this.addChild(this._loading);

    this._imgContainer = new createjs.Container();
    this.addChild(this._imgContainer);

    this._navPanels = new createjs.Shape();
    this._navPanels.visible = false;
    this._navPanels.graphics
      .beginFill('rgba(142,142,142,.2)')
      .drawRect(0, 0, this._CLICK_ZONE_WIDTH, this._height)
      .drawRect(this._width - this._CLICK_ZONE_WIDTH, 0, this._CLICK_ZONE_WIDTH, this._height)
    ;
    this.addChild(this._navPanels);

    // Parse the images
    Helpers.delayer(() => {
      let index = 0;
      this._imageData.forEach((imageData) => {
        const img = new Image();
        img.index = index++;
        img.onload = (e) => {
          console.log(`Loaded ${img.index} image.`, imageData);

          this._imgTag = new ImageWrapper(img);
          this._imgTag.setSize(this._width, this._height);
          this._imgTag.visible = false;
          this._images[img.index] = this._imgTag;
          this._imgContainer.addChild(this._imgTag);

          this._loaded();
        };
        img.onerror = (e) => {
          console.error("Failed to load image.", e);
        };
        img.src = imageData;
      });
    });
  }

  _loaded() {
    this._loadCount++;
    if (this._loadCount === this._imageData.length) {
      this._loading.visible = false;
      this._bg.visible = false;
      this._clickDisabled = false;
      this._navPanels.visible = true;
      this._images[this._viewIndex].visible = true;
    }
  }

  _setupInterface() {
    this.on('click', (e) => {
      if (this._clickDisabled) return;
      const point = Helpers.eventToLocalPoint(e, this);
      if (point.x < this._CLICK_ZONE_WIDTH) {
        // Left click
        this.prevSlide();
        console.log("<<");
      } else if (point.x > this._width - this._CLICK_ZONE_WIDTH) {
        // Right click
        this.nextSlide();
        console.log(">>");
      }
    });
  }
}