//Wait for site to load
window.addEventListener("load",function() {

var myDiv = document.getElementById("console");
console.log(myDiv.offsetWidth);
var divWidth = myDiv.offsetWidth;
var divHeight = myDiv.offsetHeight - 248;

var test = $("#lesson01");
test.prop({width: divWidth, height:divHeight});

//initiate
var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
        // Maximize this game to whatever the size of the browser is
        .setup("lesson01",{})
        // And turn on default input controls and touch input (for UI)
        .controls().touch()

Q.animations('player2', {
  right: {frames: [0, 1,2,3,4,5,6,7,8,9], rate:1/10},
  idle: {frames: [0], rate:1}
});

// ## Player Sprite
// The very basic player sprite, this is just a normal sprite
// using the player sprite sheet with default controls added to it.
Q.Sprite.extend("Player",{
  
  // the init constructor is called on creation
  init: function(p) {
    // You can call the parent's constructor with this._super(..)
    this._super(p, {
      totalTime: 0,
      timeCounter: false,
      sheet: "player2",
      sprite: "player2",  // Setting a sprite sheet sets sprite width and height
      x: 410,           // You can also set additional properties that can
      y: 90             // be overridden on object creation
    });

    // Add in pre-made components to get up and running quickly
    // The `2d` component adds in default 2d collision detection
    // and kinetics (velocity, gravity)
    // The `platformerControls` makes the player controllable by the
    // default input actions (left, right to move,  up or action to jump)
    // It also checks to make sure the player is on a horizontal surface before
    // letting them jump.

    this.add('2d, platformerControls, tween, animation');



    // Write event handlers to respond hook into behaviors.
    // hit.sprite is called everytime the player collides with a sprite
    this.on("hit.sprite",function(collision) {

      // Check the collision, if it's the Tower, you win!
      if(collision.obj.isA("Tower")) {
        Q.stageScene("endGame",1, { label: "You Won!" }); 
        this.destroy();
      }
    });
  },
  


  step: function(dt) {
    if(Q.inputs['up']) {
        console.log("up pressed");
        this.p.timeCounter = true;
      }
    if (this.p.timeCounter) {
      console.log(this.p.totalTime);
      this.p.totalTime += dt;
      this.p.vx = 100;
      if (this.p.totalTime > 1) {
        this.p.vx = 0;
        this.p.timeCounter = false;
        this.p.totalTime = 0;
      }
    }
    if (this.p.vx !== 0) {
      this.play("right");
    }
    else {
      this.play("idle");
    }
  }


});


// ## Tower Sprite
// Sprites can be simple, the Tower sprite just sets a custom sprite sheet
Q.Sprite.extend("Tower", {
  init: function(p) {
    this._super(p, { sheet: 'tower' });
  },
  step: function(dt) {
    this.p.angle += 15;
  }
});

// ## Enemy Sprite
// Create the Enemy class to add in some baddies
Q.Sprite.extend("Enemy",{
  init: function(p) {
    this._super(p, { sheet: 'enemy', vx: 100 });

    // Enemies use the Bounce AI to change direction 
    // whenver they run into something.
    this.add('2d, aiBounce');

    // Listen for a sprite collision, if it's the player,
    // end the game unless the enemy is hit on top
    this.on("bump.left,bump.right,bump.bottom",function(collision) {
      if(collision.obj.isA("Player")) { 
        Q.stageScene("endGame",1, { label: "You Died" }); 
        collision.obj.destroy();
      }
    });

    // If the enemy gets hit on the top, destroy it
    // and give the user a "hop"
    this.on("bump.top",function(collision) {
      if(collision.obj.isA("Player")) { 
        this.destroy();
        collision.obj.p.vy = -300;
      }
    });
  }
});

Q.scene("level0",function(stage) {

  document.getElementById("run").addEventListener("click", function() {
  runCode();
  alert(text2);

  });

  // Add in a repeater for a little parallax action
  stage.insert(new Q.Repeater({ asset: "background-wall.png", speedX: 0.5, speedY: 0.5 }));

  // Add in a tile layer, and make it the collision layer
  stage.collisionLayer(new Q.TileLayer({
                             dataAsset: 'level00.json',
                             sheet:     'tiles' }));


  // Create the player and add them to the stage
  var player = stage.insert(new Q.Player());
  
  /*Q.input.on('right', stage, function(e) {
      player.p.angle += 5;
  });
  Q.input.keyboardControls();*/

  // Give the stage a moveable viewport and tell it
  // to follow the player.
  stage.add("viewport").follow(player);

  // Add in a couple of enemies
  //stage.insert(new Q.Enemy({ x: 700, y: 0 }));
  //stage.insert(new Q.Enemy({ x: 800, y: 0 }));

  // Finally add in the tower goal
  stage.insert(new Q.Tower({ x: 1100, y:85 }));
});


// ## Level1 scene
// Create a new scene called level 1
Q.scene("level1",function(stage) {

  // Add in a repeater for a little parallax action
  stage.insert(new Q.Repeater({ asset: "background-wall.png", speedX: 0.5, speedY: 0.5 }));

  // Add in a tile layer, and make it the collision layer
  stage.collisionLayer(new Q.TileLayer({
                             dataAsset: 'level.json',
                             sheet:     'tiles' }));


  // Create the player and add them to the stage
  var player = stage.insert(new Q.Player());
  
  /*Q.input.on('right', stage, function(e) {
      player.p.angle += 5;
  });
  Q.input.keyboardControls();*/

  // Give the stage a moveable viewport and tell it
  // to follow the player.
  stage.add("viewport").follow(player);

  // Add in a couple of enemies
  stage.insert(new Q.Enemy({ x: 700, y: 0 }));
  stage.insert(new Q.Enemy({ x: 800, y: 0 }));

  // Finally add in the tower goal
  stage.insert(new Q.Tower({ x: 180, y: 50 }));
});


var text2 = ''
  function outf(text) {
    text = text.replace(/</g, '&lt;');
    text2 = text2 + text;
  }
  function runCode() {
    try {
      var prog = editor.getValue();
      Sk.pre = "output";
      Sk.configure({output:outf});
      var module = Sk.importMainWithBody("<stdin>", false, prog);
      console.log(prog);
      console.log("\n");
      console.log(eval(module));
      return eval(module);
    } catch (e) {
      alert(e);
    }
  }




// To display a game over / game won popup box, 
// create a endGame scene that takes in a `label` option
// to control the displayed message.
Q.scene('endGame',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));

  




  var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                  label:runCode() + text2 }))         
  var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                                   label: stage.options.label }));
  // When the button is clicked, clear all the stages
  // and restart the game.
  button.on("click",function() {
    Q.clearStages();
    Q.stageScene('level1');
  });

  // Expand the container to visibily fit it's contents
  // (with a padding of 20 pixels)
  container.fit(20);
});

// ## Asset Loading and Game Launch
// Q.load can be called at any time to load additional assets
// assets that are already loaded will be skipped
// The callback will be triggered when everything is loaded
Q.load("sprites.png, sprites.json, animation.png, sprites2.json, level.json, level00.json, tiles.png, background-wall.png", function() {
  // Sprites sheets can be created manually
  Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });

  // Or from a .json asset that defines sprite locations
  Q.compileSheets("sprites.png","sprites.json");
  Q.compileSheets("animation.png", "sprites2.json");

  // Finally, call stageScene to run the game
  Q.stageScene("level0");
}, {
  progressCallback: function(loaded,total) {
    var element = document.getElementById("loading_progress");
    element.style.width = Math.floor(loaded/total*100) + "%";
  }
  });

// ## Possible Experimentations:
// 
// The are lots of things to try out here.
// 
// 1. Modify level.json to change the level around and add in some more enemies.
// 2. Add in a second level by creating a level2.json and a level2 scene that gets
//    loaded after level 1 is complete.
// 3. Add in a title screen
// 4. Add in a hud and points for jumping on enemies.
// 5. Add in a `Repeater` behind the TileLayer to create a paralax scrolling effect.





});


