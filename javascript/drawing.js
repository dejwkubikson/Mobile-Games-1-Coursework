// Images
var mapImg;
var lifeImg;
var smallTreeImg;
var bigTreeImg;
var tank1Img;
var tank2Img;
var soldier1Img;
var soldier2Img;
var objBaseImg;
var mainMenuImg;
var menuExpandImg;
var menuHideImg;
var menuFullImg;
var menuSelectImg;
var obj1Img;
var obj2Img;
var obj2ImgEmpty;
var obj3Img;
var obj3ImgEmpty;
var obj4Img;
var obj4ImgEmpty;
var obj5Img;
var obj6Img;
var ammo1Img;
var ammo2Img;
var ammo3Img;
var ammo4Img;
var reloadImg;
var popUpImg;
var rangeImg;
var btnCancel;
var btnConfirm;
var btnInstructions;
var btnRestart;
var btnStart;
var btnNext;
var btnPrev;
var btnResume;
var endScreenImg;
var shadowImg;
var pauseImg;
var prohibitedImg;
var rocketFlameImg;

// Image arrays
var instructionImages = new Array();
var tankExplosionImgArray = new Array();
var rocketExplosionImgArray = new Array();

// Variables for money shake animation
var shakeMoneyTimer = 0;
var shakeMoney = false;
var shakeMoneyPositive = false;

// Drawing remove confirmation pop up box
function drawRemoveConfirmation() {
    // Checking if the confirmation should be shown
    if (!showRemoveConfirmation)
        return;

    // Checking if an object to remove has been selected
    if (objToRemove == null || objToRemove == undefined)
        return;

    // Pop up image
    context.drawImage(popUpImg, canvas.width / 2 - popUpImg.width / 2, canvas.height / 2 - popUpImg.height / 2, popUpImg.width, popUpImg.height);

    // Draw text
    // Drawing main text
    var mainTxt = "Are you sure you want to remove " + objToRemove.name + "?";
    context.fillStyle = "#FFF";
    context.font = "30px Oswald";
    context.fillText(mainTxt, canvas.width / 2 - context.measureText(mainTxt).width / 2, canvas.height / 2 - halfTileSize * 3);

    // Drawing the image of the object to be removed
    // If it is a player object draw base as well
    if (objToRemove.type == "player-object") {
        context.drawImage(objBaseImg, canvas.width / 2 - objBaseImg.width / 2, canvas.height / 2 - halfTileSize * 2, objBaseImg.width, objBaseImg.height);
    }
    context.drawImage(objToRemove.image, canvas.width / 2 - objToRemove.image.width / 2, canvas.height / 2 - halfTileSize * 2, objToRemove.image.width, objToRemove.image.height);

    // Drawing secondary text
    var secondaryTxt = "This will cost you $" + obstacleRemovePrice + ".";
    context.fillText(secondaryTxt, canvas.width / 2 - context.measureText(secondaryTxt).width / 2, canvas.height / 2 + objToRemove.image.height);

    // Draw Cancel and Confirm buttons
    context.drawImage(btnCancel, canvas.width / 2 - btnCancel.width - btnCancel.width / 2, canvas.height / 2 + popUpImg.height / 4, btnCancel.width, btnCancel.height);
    context.drawImage(btnConfirm, canvas.width / 2 + btnConfirm.width / 2, canvas.height / 2 + popUpImg.height / 4, btnConfirm.width, btnConfirm.height);
}

// Draws object's range
function drawObjectRange() {
    // Checking if an object has been selected
    if (selectedMapObject == null || selectedMapObject == undefined)
        return;

    // Checking if the object isn't an obstacle
    if (selectedMapObject.type == "obstacle")
        return;

    // Checking if an object remover hasn't been selected.
    if (obstacleRemoverSelected)
        return;

    // Getting the size to display
    var size = selectedMapObject.range * tileSize * 2;
    // Drawing a circle from the middle of the object
    var centreX = selectedMapObject.posX + selectedMapObject.image.width / 2 - size / 2;
    var centreY = selectedMapObject.posY + selectedMapObject.image.height / 2 - size / 2;
    // Drawing the range image
    context.drawImage(rangeImg, centreX, centreY, size, size);
}

// Draws the map of the game (background)
function drawMap() {
    context.drawImage(mapImg, 0, 0, mapImg.width, mapImg.height);
}

// Draws the main menu screen
function drawMainMenu() {
    // Draw background
    context.drawImage(mainMenuImg, 0, 0, mainMenuImg.width, mainMenuImg.height);

    // Draw buttons
    context.drawImage(btnStart, canvas.width / 2 - btnStart.width / 2, canvas.height / 2, btnStart.width, btnStart.height);
    context.drawImage(btnInstructions, canvas.width / 2 - btnInstructions.width / 2, canvas.height / 2 + btnInstructions.height + halfTileSize, btnInstructions.width, btnInstructions.height);
}

// Draws the instructions screen
function drawInstructions(pageNo) {
    // Getting the image to display depending on current page
    var img = instructionImages[pageNo - 1];

    // Drawing the appropriate image
    context.drawImage(img, 0, 0, img.width, img.height);

    // Draw buttons depending on current instruction page
    if (pageNo == 1) {
        // Draw Next button only
        context.drawImage(btnNext, canvas.width / 2 + tileSize / 4, canvas.height - btnNext.height - tileSize / 4, btnNext.width, btnNext.height);
    } else if (pageNo == 2) {
        // Draw Next and Previous buttons
        context.drawImage(btnPrev, canvas.width / 2 - btnPrev.width - tileSize / 4, canvas.height - btnPrev.height - tileSize / 4, btnPrev.width, btnPrev.height);
        context.drawImage(btnNext, canvas.width / 2 + tileSize / 4, canvas.height - btnNext.height - tileSize / 4, btnNext.width, btnNext.height);
    } else if (pageNo == 3) {
        // Draw Start and Previous buttons
        context.drawImage(btnPrev, canvas.width / 2 - btnPrev.width - tileSize / 4, canvas.height - btnPrev.height - tileSize / 4, btnPrev.width, btnPrev.height);
        context.drawImage(btnStart, canvas.width / 2 + tileSize / 4, canvas.height - btnStart.height - tileSize / 4, btnStart.width, btnStart.height);
    }
}

// Draws the end screen
function drawEndScreen() {
    // Remove enemies
    enemyObjArray.length = 0;

    // Draw the map, obstacles and player objects
    drawMap();
    drawObstacles();
    drawPlayerObjects();

    // Draw overlay 'shadow' image
    context.drawImage(shadowImg, 0, 0, shadowImg.width, shadowImg.height);

    // Draw game over
    context.drawImage(endScreenImg, 0, 0, endScreenImg.width, endScreenImg.height);

    // Draw text stats
    var text = "YOUR DEFENCE HAS BEEN BREACHED!";
    var endTime = "Time: " + msToMMSS(gameTimer);
    var endWave = "Wave: " + wave;
    var endMoney = "Money : $" + money;

    // Setting the text to be white and use Oswald 30px font.
    context.fillStyle = "#FFF";
    context.font = "30px Oswald";
    context.fillText(text, canvas.width / 2 - context.measureText(text).width / 2, canvas.height / 2 - tileSize * 2 + halfTileSize);
    context.fillText(endTime, canvas.width / 2 - context.measureText(endTime).width / 2, canvas.height / 2 - tileSize * 2 + halfTileSize * 2);
    context.fillText(endWave, canvas.width / 2 - context.measureText(endWave).width / 2, canvas.height / 2 - tileSize * 2 + halfTileSize * 3);
    context.fillText(endMoney, canvas.width / 2 - context.measureText(endMoney).width / 2, canvas.height / 2 - tileSize * 2 + halfTileSize * 4);

    // Saving player's best if not yet saved
    if (!playerBestSaved) {
        if (playerBestTime < gameTimer)
            playerBestTime = gameTimer;

        if (playerBestWave < wave)
            playerBestWave = wave;

        savePlayersBest(playerBestTime, playerBestWave);
    }

    var yourBestTime = "Your best time: " + msToMMSS(playerBestTime);
    var yourBestWave = "Your best wave: " + playerBestWave;

    context.fillText(yourBestTime, canvas.width / 2 - context.measureText(yourBestTime).width / 2, canvas.height / 2 - tileSize * 2 + halfTileSize * 7);
    context.fillText(yourBestWave, canvas.width / 2 - context.measureText(yourBestWave).width / 2, canvas.height / 2 - tileSize * 2 + halfTileSize * 8);

    // Draw Restart button
    context.drawImage(btnRestart, canvas.width / 2 - btnRestart.width / 2, canvas.height - btnRestart.height - tileSize / 4, btnRestart.width, btnRestart.height);
}

// Draws side menu
function drawSideMenu() {
    // Checking if the side menu is expanded
    if (menuExpanded) {
        // Drawing side menu
        context.drawImage(menuFullImg, canvas.width - menuFullImg.width, 0, menuFullImg.width, menuFullImg.height);

        // Drawing hide button
        context.drawImage(menuHideImg, canvas.width - menuFullImg.width - menuHideImg.width, 0, menuHideImg.width, menuHideImg.height);
        if (selectedMenuObject) {
            context.drawImage(menuSelectImg, canvas.width - menuSelectImg.width, (menuSelectedRow - 1) * tileSize);
        }
    }
    else {
        // Else drawing expand menu button
        context.drawImage(menuExpandImg, canvas.width - menuExpandImg.width, 0, menuExpandImg.width, menuExpandImg.height);
    }
}

// Draws money shake animation
function shakeMoneyAnimation(type) {
    if (shakeMoneyTimer == 0 && shakeMoney == false) {
        shakeMoney = true;
        shakeMoneyPositive = type;
    } else {
        shakeMoneyTimer += frameTime;
        if (shakeMoneyTimer >= 0.2 * 1000) {
            shakeMoney = false;
            shakeMoneyTimer = 0;
        }
    }
}

// Draws information text
function drawInfoText() {
    var textToDisplay = infoText;
    if (textToDisplay.length > 0) {
        infoTextTimer -= frameTime;

        context.font = "30px Oswald";
        context.fillStyle = "#FFF";
        context.fillText(textToDisplay, canvas.width / 2 - context.measureText(textToDisplay).width / 2, tileSize);

        // Resetting the information text if the display time has elapsed
        if (infoTextTimer <= 0)
            infoText = "";
    }
}

// Drawing player stats (timer, wave, lifes, money)
function drawPlayerStats() {
    // Drawing timer
    // Getting game time in mm:ss format.
    var timer = msToMMSS(gameTimer);

    var textToDisplay = timer + " (" + wave + ")";

    context.font = "30px Oswald";
    context.fillStyle = "#FFF";
    context.fillText(textToDisplay, canvas.width / 2 - context.measureText(textToDisplay).width / 2, halfTileSize);

    // Drawing money
    textToDisplay = "$" + money;
    // Checking if money is to be animated
    if (shakeMoney) {
        shakeMoneyAnimation(shakeMoneyPositive);
        // If the shake is to be positive setting the color to green. Otherwise to red.
        if (shakeMoneyPositive)
            context.fillStyle = "#77dd77";
        else
            context.fillStyle = "#fe6a63";

        // Getting random offsets to shake the money
        var xRandOffset = Math.random() * (10 - 1) + 1; // between 1 and 10
        var positive = Math.floor(Math.random() * Math.floor(2)); // 0 means no 1 means yes
        if (positive == 0)
            xRandOffset *= -1;
        var yRandOffset = Math.random() * (10 - 1) + 1; // between 1 and 10
        positive = Math.floor(Math.random() * Math.floor(2)); // 0 means no 1 means yes
        if (positive == 0)
            yRandOffset *= -1;

        // Drawing the money with offsets and set colour
        context.fillText(textToDisplay, tileSize / 4 + xRandOffset, canvas.height - tileSize / 4 + yRandOffset);
    }
    else {
        // Else draw money normally
        context.fillText(textToDisplay, tileSize / 4, canvas.height - tileSize / 4);
    }

    // Drawing lives
    var allLifesWidth = 0;
    // If its the last life removing the (tileSize / 8) offset
    if (lifes == 1) {
        allLifesWidth = lifeImg.width;
    }
    else {
        allLifesWidth = (lifeImg.width + tileSize / 8) * lifes;
    }

    for (var i = 0; i < lifes; i++) {
        context.drawImage(lifeImg, canvas.width / 2 - allLifesWidth / 2 + (lifeImg.width + 8) * i, canvas.height - lifeImg.height - tileSize / 4, lifeImg.width, lifeImg.height);
    }
}

// Drawing reload animation
function drawReloading(obj) {
    context.save();
    context.translate(obj.posX + reloadImg.width / 2, obj.posY + reloadImg.height / 2);
    // Getting the angle using object's current reload time
    context.rotate(obj.reloadTimer / Math.PI / 100);
    context.drawImage(reloadImg, -reloadImg.width / 2, -reloadImg.height / 2, reloadImg.width, reloadImg.height);
    context.restore();
}

// Draws the obstacles on the map (trees)
function drawObstacles() {
    for (var i = 0; i < obstaclesArray.length; i++) {
        var obstacle = obstaclesArray[i];
        context.drawImage(obstacle.image, obstacle.posX, obstacle.posY, obstacle.image.width, obstacle.image.height);
    }
}

// Draws player objects on the map
function drawPlayerObjects() {
    for (var i = 0; i < playerObjArray.length; i++) {
        var obj = playerObjArray[i];
        var imgToUse;

        // If the object is reloading showing its out of ammo image
        if (obj.reloading)
            imgToUse = obj.emptyImage;
        else
            imgToUse = obj.image;

        // Drawing base image
        context.drawImage(objBaseImg, obj.posX, obj.posY, objBaseImg.width, objBaseImg.height);

        if (!pausedGame)
            objectBehaviour(obj);

        if (enemyObjArray.length > 0) {
            // Check if enemy is within range
            for (var x = 0; x < enemyObjArray.length; x++) {
                var enemy = enemyObjArray[x];
                var tileDist = getTileDistance(obj.posX, obj.posY, enemy.posX, enemy.posY);

                context.save();
                // Checking if enemy is within object's range
                if (obj.range >= tileDist) {
                    //console.log("Object in range!");
                    // Rotating the object towards the enemy
                    obj.rotation = getAngleTowardsObject(obj.posX, obj.posY, enemy.posX, enemy.posY) * Math.PI / 180;
                    context.translate(obj.posX + imgToUse.width / 2, obj.posY + imgToUse.height / 2);
                    context.rotate(obj.rotation);
                    context.drawImage(imgToUse, -imgToUse.width / 2, -imgToUse.height / 2, imgToUse.width, imgToUse.height);

                    shootAtEnemy(obj, enemy);
                    context.restore();
                    // breaking the for loop to make the objects attack the first enemy (closest to end point)
                    break;
                }
                else {
                    //console.log("Not in range Dist: ");
                    // Draw image with last recorded rotation
                    context.translate(obj.posX + imgToUse.width / 2, obj.posY + imgToUse.height / 2);
                    context.rotate(obj.rotation);
                    context.drawImage(imgToUse, -imgToUse.width / 2, -imgToUse.height / 2, imgToUse.width, imgToUse.height);
                    context.restore();
                }
            }
        }
        else {
            // If no enemies just draw the object with last recorded rotation
            context.save();
            context.translate(obj.posX + imgToUse.width / 2, obj.posY + imgToUse.height / 2);
            context.rotate(obj.rotation);
            context.drawImage(imgToUse, -imgToUse.width / 2, -imgToUse.height / 2, imgToUse.width, imgToUse.height);
            context.restore();
        }
    }
}

// Draws bullets
function drawBullets() {
    if (!pausedGame)
        moveBullets();

    for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        context.save();
        // Rotate the bullet towards enemy
        bullet.rotation = getAngleTowardsObject(bullet.posX, bullet.posY, bullet.enemy.posX, bullet.enemy.posY) * Math.PI / 180;
        context.translate(bullet.posX + bullet.image.width / 2, bullet.posY + bullet.image.height / 2);
        context.rotate(bullet.rotation);
        context.drawImage(bullet.image, -bullet.image.width / 2, -bullet.image.height / 2, bullet.image.width, bullet.image.height);

        // Drawing flames at the end of the rocket
        if (bullet.type == "rockets") {
            context.drawImage(rocketFlameImg, -bullet.image.width / 2, -bullet.image.height / 2 + tileSize / 4, rocketFlameImg.width, rocketFlameImg.height);
        }

        context.restore();
    }
}

// Draws special effects (rocket and tank explosions)
function drawSpecialEffects() {
    // Drawing rocket explosions first
    for (var i = 0; i < rocketExplosionArray.length; i++) {
        var animObj = rocketExplosionArray[i];

        if (animObj.framesPassed < rocketExplosionImgArray.length) {
            var img = rocketExplosionImgArray[animObj.framesPassed];
            context.drawImage(img, animObj.posX, animObj.posY, img.width, img.height);
            animObj.framesPassed++;
        }
    }

    // Remove animations that have finished
    rocketExplosionArray = rocketExplosionArray.filter(function (el) { return el.framesPassed < rocketExplosionImgArray.length });

    // Drawing tank explosions
    for (var i = 0; i < tankExplosionsArray.length; i++) {
        var animObj = tankExplosionsArray[i];

        if (animObj.framesPassed < tankExplosionImgArray.length) {
            var img = tankExplosionImgArray[animObj.framesPassed];
            context.drawImage(img, animObj.posX, animObj.posY, img.width, img.height);
            animObj.framesPassed++;
        }
    }

    // Remove animations that have finished
    tankExplosionsArray = tankExplosionsArray.filter(function (el) { return el.framesPassed < tankExplosionImgArray.length });
}

// Draws enemies
function drawEnemies() {
    if (!pausedGame)
        moveEnemies();

    for (var i = 0; i < enemyObjArray.length; i++) {
        var enemy = enemyObjArray[i];
        context.save();
        context.translate(enemy.posX, enemy.posY);
        // Rotating the enemy depending on current direction
        switch (movePoints[enemy.pointReached].direction) {
            case "up":
                context.rotate(-90 * Math.PI / 180);
                context.drawImage(enemy.image, -tileSize, 0, enemy.image.width, enemy.image.height);
                break;
            case "down":
                context.rotate(90 * Math.PI / 180);
                context.drawImage(enemy.image, 0, -tileSize, enemy.image.width, enemy.image.height);
                break;
            case "left":
                context.rotate(-180 * Math.PI / 180);
                context.drawImage(enemy.image, -tileSize, -tileSize, enemy.image.width, enemy.image.height);
                break;
            case "right":
                context.rotate(0);
                context.drawImage(enemy.image, 0, 0, enemy.image.width, enemy.image.height);
                break;
            default:
                break;
        }

        context.restore();
    }
}

// Draws prohibited image
function drawProhibited() {
    for (var i = 0; i < prohibitedObjArray.length; i++) {
        var obj = prohibitedObjArray[i];
        obj.timer += frameTime;
        if (obj.timer <= 1 * 1000) {
            // Creating a pulsing effect.
            context.globalAlpha = Math.sin(obj.timer / 100);
            context.drawImage(prohibitedImg, obj.posX, obj.posY, prohibitedImg.width, prohibitedImg.height);
            context.globalAlpha = 1.0;
        }
    }

    // Remove objects that time elapsed
    prohibitedObjArray.filter(function (el) { return el.timer < 1 * 1000 });
}

// Responsible for executing all drawing functions
function drawGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawMap();
    drawObjectRange();
    drawObstacles();
    drawBullets();
    drawPlayerObjects();
    drawEnemies();
    drawSideMenu();
    drawPlayerStats();
    drawInfoText();
    drawProhibited();
    drawSpecialEffects();
    drawRemoveConfirmation();
    context.fill();
}

// Draws pause screen
function drawPause() {
    // Draw 'shadow' image
    context.drawImage(shadowImg, 0, 0, shadowImg.width, shadowImg.height);

    // Draw Pause text (image)
    context.drawImage(pauseImg, 0, 0, pauseImg.width, pauseImg.height);

    // Draw resume button
    context.drawImage(btnResume, canvas.width / 2 - btnResume.width / 2, canvas.height / 2, btnResume.width, btnResume.height);
}