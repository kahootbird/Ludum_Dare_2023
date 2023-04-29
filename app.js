const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x000000,
});
document.body.appendChild(app.view);

PIXI.loader
  .add("menuImage", "assets/menuImage.png")
  .add("playButton", "assets/playButton.png")
  .add("backButton", "assets/backButton.png")
    .add("hand", "assets/hand.png")
    .add("mail", "assets/mail.png")
    .add("mailbox", "assets/mailbox.png")
  .load(setup);

let menuImage, playButton, backButton;

function setup() {


  // Create menu image
  menuImage = new PIXI.Sprite(PIXI.loader.resources.menuImage.texture);
  menuImage.width = app.view.width;
  menuImage.height = app.view.height;
  app.stage.addChild(menuImage);

  // Create play button
  playButton = new PIXI.Sprite(PIXI.loader.resources.playButton.texture);
  playButton.anchor.set(0.5);
  playButton.x = app.view.width / 2;
  playButton.y = app.view.height / 2;
  playButton.interactive = true;
  playButton.buttonMode = true;
  playButton.on('pointerdown', startGame);
  app.stage.addChild(playButton);
}

var hand, mail, mailbox;
var handRotationSpeed = 0.05;


  function startGame() {

  app.stage.removeChild(playButton);
    // ...

    //backButton = new PIXI.Sprite(PIXI.loader.resources.button.texture);
    // Set hand properties (position, anchor, etc.)

    // Create hand sprite
    hand = new PIXI.Sprite(PIXI.loader.resources.hand.texture);
    // Set hand properties (position, anchor, etc.)
    app.stage.addChild(hand);

    // Create mail sprite
    mail = new PIXI.Sprite(PIXI.loader.resources.mail.texture);
    // Set mail properties (position, anchor, etc.)
    app.stage.addChild(mail);

    // Create mailbox sprite
    mailbox = new PIXI.Sprite(PIXI.loader.resources.mailbox.texture);
    // Set mailbox properties (position, anchor, etc.)
    app.stage.addChild(mailbox);

    // ...
    app.stage.interactive = true;
  app.stage.on("pointerdown", handleClick);


  hand.anchor.set(0.5);
  hand.x = app.view.width / 2;
  hand.y = app.view.height / 2;

  createBackButton();
  }

  function createBackButton() {
  backButton = new PIXI.Sprite(PIXI.loader.resources.backButton.texture);
  backButton.width = 100;
  backButton.height = 50;
  backButton.interactive = true;
  backButton.buttonMode = true;

  backButton.on("pointerdown", goBackToMenu);

  app.stage.addChild(backButton);
}


  function goBackToMenu() {
    resetGame();
    app.stage.addChild(playButton);
  }


  let clickCount = 0;

  var handRotationSpeed = 0.05;

  let throwForce;

  function handleClick() {
    clickCount++;

    if (clickCount === 1) {
      handRotationSpeed = 0; // Stop hand rotation
    } else if (clickCount === 2) {
      throwForce = calculateForce(hand.rotation);
    } else if (clickCount === 3) {
      throwMail(throwForce);
    }
  }

  function throwMail(force) {
    mail.velocity = { x: force.x, y: force.y };
  }

var someFactor = 1.2
  function calculateForce(rotation) {
    // Use the rotation value to calculate the force
    // You can customize the force calculation as needed
    const force = {
      x: Math.cos(rotation) * someFactor,
      y: Math.sin(rotation) * someFactor,
    };
    return force;
  }




  function gameLoop() {
    if (hand && clickCount === 0) {
      hand.rotation += handRotationSpeed;
    } else if (clickCount === 3 && mail.velocity) {
      mail.x += mail.velocity.x;
      mail.y += mail.velocity.y;

      // Apply gravity
      mail.velocity.y += 0.3; // Adjust the value to change gravity strength
    }
  }
app.ticker.add(gameLoop);


function resetGame() {
  // Remove game objects and variables
  // ...

  // Reset game state
  // ...

  // Add menu screen elements
  app.stage.addChild(menuImage);
  app.stage.addChild(playButton);

  // Remove game loop
  // ...
}
