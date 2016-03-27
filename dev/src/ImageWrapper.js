/**
 * Created by Andrew on 3/26/16.
 */
class ImageWrapper extends createjs.Bitmap {
  /**
   * @param {Image} imageObj - The image object post-load
   */
  constructor(imageObj) {
    super(imageObj);
  }

  /**
   * Sets the size of the image.
   *
   * @param {number} width - The width of the image
   * @param {number} height - The height of the image
   */
  setSize(width, height) {
    const widthRatio = width / this.image.width;
    const heightRatio = height / this.image.height;

    this.scaleX = widthRatio;
    this.scaleY = heightRatio;
  }
}


