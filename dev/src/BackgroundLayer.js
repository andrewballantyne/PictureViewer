/**
 * Created by Andrew on 3/27/16.
 */
class BackgroundLayer extends AbstractLayer {
  /**
   * @param {number} width - The width of the bg
   * @param {number} height - The height of the bg
   */
  constructor(width, height) {
    super();

    this._width = width;
    this._height = height;
    
    this._setup();
  }
  
  _setup() {
    this._bg = new createjs.Shape();
    this._bg.graphics.beginFill('#ccc').drawRect(0, 0, this._width, this._height);
    this.addChild(this._bg);
  }
}
