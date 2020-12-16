var playerObjArray = new Array();
var enemyObjArray = new Array();
var obstaclesArray = new Array();
var bulletArray = new Array();
var prohibitedObjArray = new Array();
var rocketExplosionArray = new Array();
var tankExplosionsArray = new Array();

var objToRemove;
var selectedMapObject;

// Checks if its possible to build on given tile.
function checkIfPossibleToBuild(posX, posY) {
    var canBuild = true;

    // Checking if this tile belongs to the path the enemy moves by
    for (var i = 0; i < movementTiles.length; i++) {
        if (movementTiles[i].x == posX && movementTiles[i].y == posY) {
            canBuild = false;
            //console.log("You cannot build objects on the path.");
            infoText = "You cannot build objects on the path.";
            infoTextTimer = 3 * 1000;
            var prohibitedObj = { posX: movementTiles[i].x, posY: movementTiles[i].y, timer: 0 };
            prohibitedObjArray.push(prohibitedObj);
            break;
        }
    }

    // Checking if this tile is free from obstacles
    for (var i = 0; i < obstaclesArray.length; i++) {
        if (obstaclesArray[i].posX == posX && obstaclesArray[i].posY == posY) {
            canBuild = false;
            //console.log("You cannot build objects on obstacles.");
            infoText = "You cannot build objects on obstacles.";
            infoTextTimer = 3 * 1000;
            var prohibitedObj = { posX: obstaclesArray[i].posX, posY: obstaclesArray[i].posY, timer: 0 };
            prohibitedObjArray.push(prohibitedObj);
            break;
        }
    }

    // Checking if this tile is free from player objects
    for (var i = 0; i < playerObjArray.length; i++) {
        if (playerObjArray[i].posX == posX && playerObjArray[i].posY == posY) {
            canBuild = false;
            //console.log("You cannot build objects on top of another");
            infoText = "You cannot build object on top of another";
            infoTextTimer = 3 * 1000;
            var prohibitedObj = { posX: playerObjArray[i].posX, posY: playerObjArray[i].posY, timer: 0 };
            prohibitedObjArray.push(prohibitedObj);
            break;
        }
    }

    return canBuild;
}

// Creates player object on map
function createObjectOnMap(posX, posY, objNumber) {
    // Check if its possible to build on this tile
    if (!checkIfPossibleToBuild(posX, posY))
        return;

    // Creating new Audio() to assign object's shooting to rather than using the same audio file accross all objects.
    // This would result in playing the sound only for one object (as the sound would already be in the play() state).
    var sound = new Audio();

    // Creating a default player object. It will have the values assigned later depending on what object is to be created.
    var playerObj = {
        type: null,
        name: null,
        image: null,
        emptyImage: null,
        shotSound: null,
        posX: posX,
        posY: posY,
        price: 0,
        rotation: 0,
        damage: 0,
        ammo: 0,
        maxAmmo: 0,
        ammoSpeed: 0,
        ammoImg: null,
        barrelsNo: 0,
        range: 0,
        fireRate: 0,
        fireTimer: 0,
        outOfAmmo: false,
        reloading: false,
        reloadTime: 0, // needs to be multiplied by 1000 to change miliseconds to seconds
        reloadTimer: 0, // needs to be multiplied by 1000 to change miliseconds to seconds
        fireTimer: 0
    };

    switch (objNumber) {
        case 1:
            sound.src = shot1Sound.src;
            playerObj.type = "player-object";
            playerObj.name = "Twin Gun";
            playerObj.image = obj1Img;
            playerObj.emptyImage = obj1Img;
            playerObj.shotSound = shot1Sound;
            playerObj.price = 300;
            playerObj.damage = 3;
            playerObj.maxAmmo = 10;
            playerObj.ammo = playerObj.maxAmmo;
            playerObj.ammoSpeed = 10;
            playerObj.ammoImg = ammo1Img;
            playerObj.barrelsNo = 2;
            playerObj.range = 3;
            playerObj.fireRate = 0.1 * 1000;
            playerObj.reloadTime = 4 * 1000;
            break;
        case 2:
            sound.src = shot2Sound.src;
            playerObj.type = "player-object";
            playerObj.name = "Twin Rockets";
            playerObj.image = obj2Img;
            playerObj.emptyImage = obj2ImgEmpty;
            playerObj.shotSound = shot1Sound;
            playerObj.price = 500;
            playerObj.damage = 40;
            playerObj.maxAmmo = 2;
            playerObj.ammoSpeed = 5;
            playerObj.ammoImg = ammo3Img;
            playerObj.barrelsNo = 2;
            playerObj.range = 4;
            playerObj.fireRate = 2 * 1000;
            playerObj.reloadTime = 5 * 1000;
            break;
        case 3:
            sound.src = shot2Sound.src;
            playerObj.type = "player-object";
            playerObj.name = "Bare Rockets";
            playerObj.image = obj3Img;
            playerObj.emptyImage = obj3ImgEmpty;
            playerObj.shotSound = shot1Sound;
            playerObj.price = 1500;
            playerObj.damage = 40;
            playerObj.maxAmmo = 2;
            playerObj.ammoSpeed = 5;
            playerObj.ammoImg = ammo3Img;
            playerObj.barrelsNo = 2;
            playerObj.range = 5;
            playerObj.fireRate = 2 * 1000;
            playerObj.reloadTime = 5 * 1000;
            break;
        case 4:
            sound.src = shot2Sound.src;
            playerObj.type = "player-object";
            playerObj.name = "Big Marry";
            playerObj.image = obj4Img;
            playerObj.emptyImage = obj4ImgEmpty;
            playerObj.shotSound = shot2Sound;
            playerObj.price = 4000;
            playerObj.damage = 100;
            playerObj.maxAmmo = 2;
            playerObj.ammoSpeed = 5;
            playerObj.ammoImg = ammo4Img;
            playerObj.barrelsNo = 1;
            playerObj.range = 6;
            playerObj.fireRate = 1 * 1000;
            playerObj.reloadTime = 8 * 1000;
            break;
        case 5:
            sound.src = shot3Sound.src;
            playerObj.type = "player-object";
            playerObj.name = "Big Bertha";
            playerObj.image = obj5Img;
            playerObj.emptyImage = obj5Img;
            playerObj.shotSound = sound;
            playerObj.price = 8000;
            playerObj.damage = 30;
            playerObj.maxAmmo = 10;
            playerObj.ammoSpeed = 10;
            playerObj.ammoImg = ammo2Img;
            playerObj.barrelsNo = 1;
            playerObj.range = 6;
            playerObj.fireRate = 1 * 1000;
            playerObj.reloadTime = 6 * 1000;
            break;
        case 6:
            sound.src = shot3Sound.src;
            playerObj.type = "player-object";
            playerObj.name = "Red Brothers";
            playerObj.image = obj6Img;
            playerObj.emptyImage = obj6Img;
            playerObj.shotSound = sound;
            playerObj.price = 15000;
            playerObj.damage = 30;
            playerObj.maxAmmo = 10;
            playerObj.ammoSpeed = 10;
            playerObj.ammoImg = ammo2Img;
            playerObj.barrelsNo = 2;
            playerObj.range = 6;
            playerObj.fireRate = 1 * 1000;
            playerObj.reloadTime = 8 * 1000;
            break;
        default:
            break;
    }

    // Setting the ammo to max
    playerObj.ammo = playerObj.maxAmmo;
    // Setting the fire timer to the same value as fire rate so that first shot can be taken straight away
    playerObj.fireTimer = playerObj.fireRate;

    // Checking if the player has enough money to build the object
    if (money >= playerObj.price) {
        playerObjArray.push(playerObj);
        money -= playerObj.price;
    }
    else {
        infoText = "Not enough money to build " + playerObj.name;
        infoTextTimer = 3 * 1000;
        shakeMoneyAnimation(false);
    }

    // Resetting the selected menu object so that the player doesn't accidentally create it again.
    selectedMenuObject = false;
}

// Removes a certain object from the map
function removeObject(objToRemove) {
    // Checking if the object is an obstacle or a player object. Filtering the appropriate array for the object to remove.
    if (objToRemove.type == "obstacle") {
        obstaclesArray = obstaclesArray.filter(function (el) { return el != objToRemove });
    } else if (objToRemove.type == "player-object") {
        playerObjArray = playerObjArray.filter(function (el) { return el != objToRemove });
    }

    // Subtracting from player's money the cost of removing the object
    money -= obstacleRemovePrice;
}

// Creates an enemy object.
function createEnemy(typeToUse) {
    // Creating a default enemy object. It will have the values assigned later depending on what type of enemy is to be created.
    var enemy = {
        type: typeToUse,
        health: 100,
        armor: 0,
        speed: 0,
        posX: spawnPoint.x,
        posY: spawnPoint.y,
        image: null,
        pointReached: 0,
        isDead: false
    };

    switch (typeToUse) {
        case "tank-1":
            enemy.armor = 200;
            enemy.speed = 1;
            enemy.image = tank1Img;
            break;
        case "tank-2":
            enemy.armor = 100;
            enemy.speed = 1;
            enemy.image = tank2Img;
            break;
        case "soldier-1":
            enemy.armor = 0;
            enemy.speed = 2;
            enemy.image = soldier1Img;
            break;
        case "soldier-2":
            enemy.armor = 50;
            enemy.speed = 2;
            enemy.image = soldier2Img;
            break;
        default:
            break;
    }

    // Making the armour dependent on current wave
    enemy.armor = (wave + 1)

    // Adding the enemy object to array of enemies.
    enemyObjArray.push(enemy);
}