var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;

// Game variables
var context;
var canvas;
var currScene = "menu";
var pausedGame = false;
const tileSize = 64;
const halfTileSize = tileSize / 2; // Creates offset
var lastFrameTime = 0.0;
var frameTime = 0.0;
var infoText = "";
var infoTextTimer = 0;

// Gameplay variables
var wave = 1;
var money = 1000;
var lifes = 5;
var gameTimer = 0;
var obstacleRemovePrice = 1000;
var killEnemyMoney = 100;

// Wave variables
var waveEnemyAmount = 5;
var waveEnemyCreated = 0;
var waveEnemyCreateTimer = 0;
var waveEnemyCreateTime = 2;
var waveBreakTimer = 10;
var waveEnd = false;

// 'State'
var currInstrPage = 1;
var menuSelectedRow = 0;
var menuExpanded = false;
var selectedMenuObject = false;
var obstacleRemoverSelected = false;
var showRemoveConfirmation = false;

// Returns a string of converted milliseconds to mm:ss time
function msToMMSS(milliseconds) {
    // Converting to seconds
    var seconds = milliseconds / 1000;
    // Extracting minutes
    var minutes = parseInt(seconds / 60);
    // Getting seconds not extracted in minutes
    seconds = Math.round(seconds % 60, 0);

    // Padding 0s to minutes
    var minTxt = "0";
    if (minutes < 10)
        minTxt = "0" + minutes;
    else
        minTxt = minutes;

    // Padding 0s to seconds
    var secTxt = "0";
    if (seconds < 10)
        secTxt = "0" + seconds;
    else
        secTxt = seconds;

    return (minTxt + ":" + secTxt);
}

// Returns the distance from one point to another in tiles (player's objects range is referencing the tiles it covers)
function getTileDistance(fromX, fromY, toX, toY) {
    // Using Pythagoras theorem to get the distance between the objects
    var x = fromX - toX;
    var y = fromY - toY;
    var dist = Math.sqrt(x * x + y * y);

    return (dist / tileSize);
}

// Returns the angle from one point to another. Used to determine the rotation of player's objects towards the enemy
function getAngleTowardsObject(fromX, fromY, toX, toY) {
    // Getting the angle towards the object
    var degAngle = Math.atan2(fromX - toX, fromY - toY) * (180 / Math.PI);
    // Since objects face the top, this will be their 0* angle.
    var angleToReturn = 0;

    // If 'from' is on the right side of the to object then the angle is 'negative'
    if (fromX >= toX)
        angleToReturn = 360 - degAngle;
    else
        angleToReturn = degAngle - 360;

    return degAngle * -1;
}

// Perform normal object behaviour
function objectBehaviour(obj) {
    if (obj.ammo == 0) {
        reload(obj);
    }
}

// Creates a bullet object
function createBullet(obj, enemy) {
    // Creating bullet for each barrel an object has
    for (var i = 0; i < obj.barrelsNo; i++) {
        // Get current rotation of the object
        var angleRot = obj.rotation * (180 / Math.PI);
        var posX = obj.posX;
        var posY = obj.posY;
        // Creating an offset for the bullets if an object has two barrels.
        // Which axis is modified depends on object's rotation.
        if ((angleRot < 0 && angleRot >= - 90) || (angleRot > 0 && angleRot <= 90)) {
            posY = posY - tileSize / 8 + tileSize / 4 * i;
        } else if ((angleRot < -90 && angleRot >= -180) || (angleRot > 90 && angleRot <= 180)) {
            posX = posX - tileSize / 8 + tileSize / 4 * i;
        }

        // Checking if the object shoots rockets. This will be used to add fire and explosion special effects.
        var typeOfAmmo = "bullets";
        if (obj.ammoImg == ammo3Img || obj.ammoImg == ammo4Img) {
            typeOfAmmo = "rockets";
        }

        // Creating bullet object
        var bullet = {
            type: typeOfAmmo,
            damage: obj.damage,
            speed: obj.ammoSpeed,
            rotation: 0,
            posX: posX,
            posY: posY,
            image: obj.ammoImg,
            enemy: enemy,
            reachedEnemy: false
        };

        // Adding bullet to the array holding bullets.
        bulletArray.push(bullet);
    }
}

// Moving bullets towards the enemies
function moveBullets() {
    for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        if (bullet.enemy == undefined) {
            bullet.reachedEnemy = true;
            break;
        }
        // Getting the bullet and enemy positions difference
        var dx = bullet.enemy.posX - bullet.posX;
        var dy = bullet.enemy.posY - bullet.posY;

        // Getting the angle
        var angle = Math.atan2(dy, dx);

        // Getting the X and Y velocity
        var velX = bullet.speed * Math.cos(angle);
        var velY = bullet.speed * Math.sin(angle);

        if (dx > -5 && dx < 5 && dy > -5 && dy < 5) {
            bullet.reachedEnemy = true;
            dealDamage(bullet);

            // If the bullet is a rocket, creating a rocket explosion animation
            if (bullet.type == "rockets") {
                createRocketExplosion(bullet.enemy.posX, bullet.enemy.posY);
            }
        }

        // Adding the velocities to x and y axis
        bullet.posX += velX;
        bullet.posY += velY;
    }
}

// Dealing damage to the enemy for bullets that reached their target.
function dealDamage(bullet) {
    var enemy = bullet.enemy;

    // Subtracting from armor first
    if (enemy.armor >= 0) {
        enemy.armor -= bullet.damage;
    }
    else {
        enemy.health -= bullet.damage;
        if (enemy.health <= 0) {

            enemy.isDead = true;
            shakeMoneyAnimation(true);
        }
    }

    // Removing bullets that reached the enemy
    bulletArray = bulletArray.filter(function (el) { return el.reachedEnemy != true })
	
    // Removing enemies that died
    removeDeadEnemies();
}

// Removes the 'dead' enemies and adds player the money
function removeDeadEnemies() {
    // Getting all dead enemies into one array
    var deadArray = enemyObjArray.filter(function (el) { return el.isDead == true });

    // Adding player money for killed enemies.
    money += deadArray.length * killEnemyMoney;

    // If the object is a tank, drawing explosion animation and playing explosion sound
    for (var i = 0; i < deadArray.length; i++) {
        var obj = deadArray[i];
        if (obj.type == 'tank-1' || obj.type == 'tank-2') {
            createTankExplosion(obj.posX, obj.posY);
            playExplosionSound();
        }
    }

    // Removing the dead enemies from the array that holds the enemies.
    enemyObjArray = enemyObjArray.filter(function (el) { return el.isDead != true });
}

// Creates a tank explosion animation
function createTankExplosion(posX, posY) {
    var animObj = {
        posX: posX,
        posY: posY,
        framesPassed: 0
    };

    tankExplosionsArray.push(animObj);
}

// Creates a rocket explosion animation
function createRocketExplosion(posX, posY) {
    var animObj = {
        posX: posX,
        posY: posY,
        framesPassed: 0
    };

    rocketExplosionArray.push(animObj);
}

// Performs a reload action on player's object
function reload(obj) {
    // Setting the object as reloading. This prevents it from shooting.
    obj.reloading = true;
    // Setting the reload timer
    obj.reloadTimer += frameTime;
    // If the reload time has been reached the object successfully reloaded ammunition
    if (obj.reloadTimer >= obj.reloadTime) {
        obj.reloading = false;
        obj.ammo = obj.maxAmmo;
        obj.reloadTimer = 0;
        obj.fireTimer = obj.fireRate;
    }
    else {
        // If not finished reloading draw reloading image.
        drawReloading(obj);
    }
}

// Shoots bullets at enemy
function shootAtEnemy(obj, enemy) {
    // Checking if the object isn't reloading
    if (!obj.reloading) {
        // Checking if the object has enough ammunition
        if (obj.ammo > 0) {
            obj.fireTimer += frameTime;
            // If enough time has passed since last shot, shooting.
            if (obj.fireTimer >= obj.fireRate) {
                // Creating the bullet object
                createBullet(obj, enemy);
                obj.ammo--;
                obj.fireTimer = 0;
                // Playing object's shot sound
                playShotSound(obj.shotSound);
            }
        }
        else {
            reload(obj);
        }
    }
}

// Moves the enemies.
function moveEnemies() {
    // If at least 1 enemy reached the end point, the enemy will be removed from the array once finished working with it.
    var enemyFinished = false;

    // Sorting enemyObjArray to keep the closest enemy to the end point first.
    enemyObjArray.sort(function (a, b) {
        return b.pointReached - a.pointReached;
    });

    // Checking if enemy has reached the next point.
    for (var i = 0; i < enemyObjArray.length; i++) {
        var enemy = enemyObjArray[i];
        var nextPoint = enemy.pointReached + 1;

        if (enemy.posY == movePoints[nextPoint].y && enemy.posX == movePoints[nextPoint].x) {
            //Checking if its the last one. Else changing the nextPoint to the next one.
            if (nextPoint + 1 == movePoints.length) {
                enemyFinished = true;
                enemy.pointReached = movePoints.length - 1;
                continue;
            }
            else {
                enemy.pointReached += 1;
            }
        }

        // Gets the current direction of the enemy. Manipulating the correct axis depending on it.
        direction = movePoints[enemy.pointReached].direction;
        switch (direction) {
            case "up":
                enemy.posY = enemy.posY - enemy.speed;
                break;
            case "down":
                enemy.posY = enemy.posY + enemy.speed;
                break;
            case "left":
                enemy.posX = enemy.posX - enemy.speed;
                break;
            case "right":
                enemy.posX = enemy.posX + enemy.speed;
                break;
            default:
                break;
        }
    }

    // If enemy reached the end point executing endPointReached() function.
    if (enemyFinished)
        endPointReached();
}

// Reduces player's money and lifes, removes enemies that reached the end point.
function endPointReached() {
    // Removing all enemies that reached the end point
    enemyObjArray = enemyObjArray.filter(function (el) { return el.pointReached != movePoints.length - 1 })

    // Removing one life
    lifes--;
    if (lifes <= 0)
        endGame();

    // Reducing money
    shakeMoneyAnimation(false);
    if (money >= 500)
        money -= 500;
    else
        money = 0;
}

// Restarts the game. Defaults all variables.
function restartGame() {
    wave = 1;
    waveEnd = false;
    waveEnemyAmount = 5;
    waveEnemyCreated = 0;
    waveEnemyCreateTimer = 0;
    enemyObjArray.length = 0;
    money = 1000;
    lifes = 5;
    gameTimer = 0;
    playerObjArray.length = 0;
    bulletArray.length = 0;
    menuExpanded = false;
    obstaclesArray.length = 0;
    obstacleRemoverSelected = false;
    showRemoveConfirmation = false;
    objToRemove = null;
    selectedMapObject = null;
    selectedMenuObject = false;
    prohibitedObjArray.length = 0;
    infoText = "";
    infoTextTimer = 0;
    startGame();
}

// Starts the game by creating obstacles and setting the current scene.
function startGame() {
    createObstacles();
    currScene = "game";
}

// Shows the instructions screen.
function showInstructions() {
    currScene = "instructions";
    currInstrPage = 1;
}

// Changes current scene to end. This takes the player to the end screen.
function endGame() {
    currScene = "end";
}

// Update
function update() {
    switch (currScene) {
        case "menu":
            drawMainMenu();
            break;
        case "instructions":
            drawInstructions(currInstrPage);
            break;
        case "game":
            var now = performance.now();
            if (lastFrameTime == 0.0)
                lastFrameTime = now;
            // Setting the frame time
            frameTime = now - lastFrameTime;
            lastFrameTime = now;

            // Checking if the game isn't paused
            if (!pausedGame) {
                // Adding frame time to game time
                gameTimer += frameTime;
                // Creating enemy wave
                createWave(frameTime);
            }

            // Drawing the full game
            drawGame();

            // Displaying information dependent on user selection
            if (selectedMenuObject && !obstacleRemoverSelected) {
                infoText = "Click on the map to create the object.";
                infoTextTimer = frameTime * 2;
            }

            // Displaying information dependent on user selection
            if (obstacleRemoverSelected && !objToRemove) {
                infoText = "Click on an object on the map to remove it.";
                infoTextTimer = frameTime * 2;
            }

            // Drawing pause screen and pausing the music if game is paused.
            if (pausedGame) {
                pauseBackgroundMusic();
                drawPause();
            }
            else {
                playBackgroundMusic();
            }

            break;
        case "end":
            drawEndScreen();
            break;
        default:
            break;
    }
    // Calling the update after redrawing
    requestAnimationFrame(update);
}

// Returns the randomly generated enemy type
function getEnemyType() {
    // Creating tank-2 or solider-2 only after wave 4
    if (wave < 5) {
        var rand = Math.floor(Math.random() * (3 - 1)) + 1; // Generating a random number 1 or 2
        switch (rand) {
            case 1:
                return 'tank-1';
                break;
            case 2:
                return 'soldier-1';
                break;
            default:
                return 'tank-1';
                break;
        }
    }
    else {
        var rand = Math.floor(Math.random() * (5 - 1)) + 1; // Generating a random number between 1 and 4
        switch (rand) {
            case 1:
                return 'tank-1';
                break;
            case 2:
                return 'soldier-1';
                break;
            case 3:
                return 'tank-2';
                break;
            case 4:
                return 'soldier-2';
                break;
            default:
                return 'tank-2';
                break;
        }
    }
}

// Adds player money, creates a new wave after break time period
function waitForNextWave(timer) {
    // Waiting for all enemies to get killed / reach the next point
    if (enemyObjArray.length == 0) {
        // Making sure the player receives the money once.
        if (waveEnemyCreateTimer == 0) {
            // Giving player money. Playing green coloured animation.
            shakeMoneyAnimation(true);
            money += 500;

            // Making all objects reload to get ready for next wave.
            for (var i = 0; i < playerObjArray.length; i++) {
                if (playerObjArray[i].ammo != playerObjArray[i].maxAmmo)
                    playerObjArray[i].ammo = 0;
            }
        }

        waveEnemyCreateTimer += timer;

        var secondsLeft = Math.floor(((waveBreakTimer * 1000) - waveEnemyCreateTimer) / 1000);

        // Displaying info text.
        infoText = "Wave " + (wave + 1) + " incomming in " + (secondsLeft + 1) + " seconds.";
        // Setting the timer to be short in order to prevent from displaying it long after the new wave has started.
        infoTextTimer = ((waveBreakTimer * 1000) - waveEnemyCreateTimer);

        // If enough time elapsed since end of last wave (converting waveBreakTimer to seconds)
        if (waveEnemyCreateTimer >= waveBreakTimer * 1000) {
            // Setting up all the amounts for the next wave
            waveEnd = false;
            wave++;
            waveEnemyCreated = 0;
            waveEnemyAmount = 5 * wave;
        }
    }
}

// Creates the enemy wave.
function createWave(timer) {
    if (!waveEnd) {
        waveEnemyCreateTimer += timer;

        // Converting waveEnemyCreateTimer to seconds
        if (waveEnemyCreateTimer >= waveEnemyCreateTime * 1000) {
            // Creating the enemy.
            createEnemy(getEnemyType());
            waveEnemyCreated++;
            waveEnemyCreateTimer = 0;

            // Generating new random create time between 0.5s to 3s (5 to 30 and diving by 10)
            waveEnemyCreateTime = (Math.floor(Math.random() * (31 - 5)) + 5) / 10;
        }

        // If all enemies for that wave have been created, setting the wave as ended.
        if (waveEnemyCreated >= waveEnemyAmount) {
            waveEnd = true;
        }
    }
    else {
        waitForNextWave(timer);
    }
}