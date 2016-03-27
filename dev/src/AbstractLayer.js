/**
 * Created by Andrew on 3/27/16.
 */
class AbstractLayer extends createjs.Container {
  constructor() {
    super();
  }

  /**
   * Shows the layer.
   */
  show() {
    this.visible = true;
  }

  /**
   * Hides the layer.
   */
  hide() {
    this.visible = false;
  }
}
