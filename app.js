const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x000000,
});
document.body.appendChild(app.view);

// Load assets
PIXI.loader
  .add("button", "assets/button.png")
  .load(setup);

let button;

function setup() {
  // Create button sprite
  button = new PIXI.Sprite(PIXI.loader.resources.button.texture);
  button.anchor.set(0.5);
  button.width = 150;
  button.height = 50;
  button.x = app.view.width / 2;
  button.y = app.view.height / 2;
  app.stage.addChild(button);
}
