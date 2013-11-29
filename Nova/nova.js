// create an new instance of a pixi stage
var stage = new PIXI.Stage(0x000000);

// create a renderer instance
var screenW = $(window).width(), screenH = $(window).height();
//var screenW = 800, screenH = 600;
var renderer = PIXI.autoDetectRenderer(screenW, screenH);
$(window).resize(onResize);
// add the renderer view element to the DOM
document.body.appendChild(renderer.view);




function will_be_ship(shipName) {
    this.name = shipName || ""
}

will_be_ship.prototype.gimmieOnJsonLoaded = function() {
    var self = this //grab the 'this' of the ship
    var onJsonLoaded = function() { //this is necessary because the shipLoader.onComplete will run this within its own scope. 
	console.log("loaded " + self.name)
    }
    return onJsonLoaded
}

will_be_ship.prototype.build = function() {
    //console.log(this.name)
    var shipAssetsToLoad = ["ships/" + this.name + '.json']
    var shipLoader = new PIXI.AssetLoader(shipAssetsToLoad)
    shipLoader.onComplete = this.gimmieOnJsonLoaded() //this function returns the function that gets run after the asset is loaded
    shipLoader.load()
}

function playerShip(shipJsonName) {
    will_be_ship.call(this, shipJsonName)
}

playerShip.prototype = new will_be_ship

playerShip.prototype.gimmieOnJsonLoaded = function() {
    var self = this
    var onJsonLoaded = function() {
	console.log("loaded my ship " + self.name)
    }
    return onJsonLoaded
}


var ship;
var shipTextures;
var shipTexture = 1;

var myShip = new playerShip("Starbridge")
myShip.build()

var starbridgeAssetsToLoader = ["ships/Starbridge.json"];
starbridgeLoader = new PIXI.AssetLoader(starbridgeAssetsToLoader);
starbridgeLoader.onComplete = onAssetsLoaded;
starbridgeLoader.load();

function onAssetsLoaded() {

    shipTextures = [];
    for (var i=0; i<108; i++) {

	var texture = PIXI.Texture.fromFrame("Starbridge " + (i+1) + ".png");
	shipTextures.push(texture);


    };
    // create a texture from an image path
    //var test = PIXI.Texture.fromImage("ships/Starbridge.png");
    // create a new Sprite using the texture
    ship = new PIXI.Sprite(shipTextures[0]);

    //ship.setTexture(shipTextures[0]);
    // center the sprites anchor point
    ship.anchor.x = 0.5;
    ship.anchor.y = 0.5;
    ship.pointing = Math.random() * 2 * Math.PI
    ship.turnRate = 0.1

    // move the sprite t the center of the screen
    ship.position.x = screenW/2;
    ship.position.y = screenH/2;
    stage.addChild(ship);    
    requestAnimFrame( animate );

}

function animate() {

    requestAnimFrame( animate );

    // just for fun, lets rotate mr rabbit a little
    //ship.rotation += 0.1;
    //ship.turnRate = 0.01
    var keys = KeyboardJS.activeKeys()
    ship.banking = 0
    if (_.contains(keys, 'right')) {
	ship.pointing += ship.turnRate
	ship.banking = 72
    }
    if (_.contains(keys, 'left')) {
	ship.pointing = ship.pointing - ship.turnRate
	ship.banking = 36
    }
    if (_.contains(keys, 'left') && _.contains(keys, 'right')) {
	ship.banking = 0
    }



    if (ship.pointing >= 2*Math.PI) {
	ship.pointing = 0
    }
    if (ship.pointing < 0) {
	ship.pointing += 2*Math.PI
    }

    var shipRange = ship.pointing * 36 / (2*Math.PI)
    shipTexture = Math.floor(shipRange) + ship.banking

    ship.rotation = ((shipRange % 1 - 0.5) * Math.PI / 18)


    ship.setTexture(shipTextures[shipTexture])


    //if (shipTexture < 35) {
	//shipTexture++
   // }
    //else {
	//shipTexture = 1
    //}

    ship.position.x = screenW/2;
    ship.position.y = screenH/2;
    // render the stage   
    renderer.render(stage);
}

function onResize() {
    screenW = $(window).width();
    screenH = $(window).height();
    renderer.resize(screenW,screenH);
}

