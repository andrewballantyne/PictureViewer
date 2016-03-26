/**
 * Created by Andrew on 3/26/16.
 */
class ImageWrapper extends createjs.Bitmap {
  constructor(imageObj) {
    super(imageObj);
  }

  setSize(width, height) {
    const widthRatio = width / this.image.width;
    const heightRatio = height / this.image.height;

    this.scaleX = widthRatio;
    this.scaleY = heightRatio;
  }
}


