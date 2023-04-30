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
var gameWon = false;

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
  // Create hand sprite
  hand = new PIXI.Sprite(PIXI.loader.resources.hand.texture);
  app.stage.addChild(hand);

  // Create mail sprite
  mail = new PIXI.Sprite(PIXI.loader.resources.mail.texture);
  app.stage.addChild(mail);
  mail.x = 200
  mail.y = 200

  // Create mailbox sprite
  mailbox = new PIXI.Sprite(PIXI.loader.resources.mailbox.texture);
  app.stage.addChild(mailbox);

  hand.scale.x = -1;
mail.scale.x = -1;

  app.stage.interactive = true;
  app.stage.on("pointerdown", handleClick);
  hand.anchor.set(0.5);
  hand.x = app.view.width / 2;
  hand.y = app.view.height / 2;
  createBackButton();

  app.stage.on("pointerdown", () => {
    if (clickCount === 0) {
      handRotationSpeed = 0;
      clickCount++;
    } else if (clickCount === 1) {
      let force = 10; // You can adjust the force as needed
      throwMail(force);
      clickCount++;
    }
  });
  const mailboxTopRightArea = {
  x: app.view.width * 0.7,
  y: app.view.height * 0.1,
  width: app.view.width * 0.3,
  height: app.view.height * 0.4,
};

mailbox.x = mailboxTopRightArea.x + Math.random() * mailboxTopRightArea.width;
mailbox.y = mailboxTopRightArea.y + Math.random() * mailboxTopRightArea.height;

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
  app.stage.off("pointerdown"); // Add this line to remove the event listener
}

var clickCount = 0;
var handRotationSpeed = 0.05;

let throwForce;

function handleClick() {
  clickCount++;

  if (clickCount === 1) {
    handRotationSpeed = 0; // Stop hand rotation
  } else if (clickCount === 2) {
    // Do nothing
  } else if (clickCount === 3) {
    throwMail();
    clickCount = 0; // Reset clickCount
  }
}

var m_velocity_x = null;
var m_velocity_y = null;

function throwMail() {
  let angle = hand.rotation;
  let force = calculateForce(angle);
  let scalarForce = Math.sqrt(force.x * force.x + force.y * force.y); // Calculate the scalar force
  mail.velocity = { x: Math.cos(angle) * scalarForce, y: Math.sin(angle) * scalarForce };
  console.log("REAL VEL" + [mail.velocity.x, mail.velocity.y]);
}
  // ... (setup, startGame, createBackButton, and goBackToMenu functions)

var clickCount = 0;
var handRotationSpeed = 0.05;



function handleClick() {
  clickCount++;

  if (clickCount === 1) {
    handRotationSpeed = 0; // Stop hand rotation
  } else if (clickCount === 2) {
    // Do nothing
  } else if (clickCount === 3) {
    throwMail();
    clickCount = 0; // Reset clickCount
  }
}

function throwMail() {
  let angle = hand.rotation;
  let force = calculateForce(angle);
  let scalarForce = Math.sqrt(force.x * force.x + force.y * force.y); // Calculate the scalar force
  mail.velocity = { x: Math.cos(angle) * scalarForce, y: Math.sin(angle) * scalarForce };
  console.log("REAL VEL" + [mail.velocity.x, mail.velocity.y]);
}
var someFactor = 1.2;
function calculateForce(rotation) {
  // Use the rotation value to calculate the force
  // You can customize the force calculation as needed
  const someFactor = 1.2;
  const force = {
    x: Math.cos(rotation) * someFactor,
    y: Math.sin(rotation) * someFactor,
  };
  return force;
}

var startTime = null;
var rotation_done = 0
function gameLoop() {
  if (hand && clickCount === 0) {
    hand.rotation += handRotationSpeed;

    // Check rotation bounds
    if (hand.rotation >= Math.PI || hand.rotation <= 0) {
      handRotationSpeed = -handRotationSpeed;
    }

    // Update mail position and rotation
    mail.x = hand.x;
    mail.y = hand.y;
    mail.rotation = hand.rotation;
    rotation_done = 1
  }

  else if (rotation_done == 1 ){
    mail.x -= mail.velocity.x;
    mail.y -= mail.velocity.y;
    console.log("VELOCITY: " + mail.velocity.x);

    // Check for collision with the mailbox
    if (hitTestRectangle(mail, mailbox)) {
      showWinMessage();
      return;
    }

    // Check if 4 seconds have passed without a collision
    if (!startTime) {
      startTime = Date.now();
    } else if (Date.now() - startTime > 4000 && !gameWon) {
      showLoseMessage();
      return;
    }

  }
}

function showWinMessage() {
  const winText = new PIXI.Text("You won!", { fontFamily: "Arial", fontSize: 32, fill: "white" });
  winText.x = app.view.width / 2;
  winText.y = app.view.height / 2;
  winText.anchor.set(0.5);
  app.stage.addChild(winText);
    gameWon = true;
}

function showLoseMessage() {
  const loseText = new PIXI.Text("You lost!", { fontFamily: "Arial", fontSize: 32, fill: "white" });
  loseText.x = app.view.width / 2;
  loseText.y = app.view.height / 2;
  loseText.anchor.set(0.5);
  app.stage.addChild(loseText);
}

function hitTestRectangle(r1, r2) {
  const r1Bounds = r1.getBounds();
  const r2Bounds = r2.getBounds();

  return !(
    r1Bounds.x + r1Bounds.width < r2Bounds.x ||
    r1Bounds.y + r1Bounds.height < r2Bounds.y ||
    r1Bounds.x > r2Bounds.x + r2Bounds.width ||
    r1Bounds.y > r2Bounds.y + r2Bounds.height
  );
}


app.ticker.add(gameLoop);

function resetGame() {
  // Reset game state
  rotation_done = 0
  clickCount = 0;
  handRotationSpeed = 0.05;
  startTime = null;
  gameWon = false;

  // Reset hand and mail positions and rotations
  if (hand) {
    hand.rotation = 0;
    hand.x = app.view.width / 2;
    hand.y = app.view.height / 2;
  }

  if (mail) {
    mail.rotation = 0;
    mail.x = hand.x;
    mail.y = hand.y;
    mail.velocity = null;
  }

  // Reset mailbox position
  if (mailbox) {
    mailbox.x = app.view.width - mailbox.width - 20;
    mailbox.y = Math.random() * (app.view.height / 2 - mailbox.height);
  }
  // Clear any existing win or lose messages
  clearMessages();

  app.stage.addChild(menuImage);
  app.stage.addChild(playButton);
  app.stage.removeChild(hand)
app.stage.removeChild(mail)
app.stage.removeChild(mailbox)
}
function clearMessages() {
}
