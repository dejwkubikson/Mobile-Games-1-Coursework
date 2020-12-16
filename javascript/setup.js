// Resources variables
var currentResource = 0;
var resourcesToLoad = 59;

// The starting point for enemies
var spawnPoint = {
    x: tileSize + halfTileSize,
    y: -tileSize,
    direction: "down"
};

// The end point for enemies
var endPoint = {
    x: tileSize * 15 + halfTileSize,
    y: tileSize + halfTileSize,
    direction: "right"
};

// Enemy move points
var movePoints = [spawnPoint, { x: tileSize + halfTileSize, y: tileSize + halfTileSize, direction: "right" }, { x: tileSize * 7 + halfTileSize, y: tileSize + halfTileSize, direction: "down" },
    { x: tileSize * 7 + halfTileSize, y: tileSize * 4 + halfTileSize, direction: "left" }, { x: tileSize + halfTileSize, y: tileSize * 4 + halfTileSize, direction: "down" },
    { x: tileSize + halfTileSize, y: tileSize * 6 + halfTileSize, direction: "right" }, { x: tileSize * 9 + halfTileSize, y: tileSize * 6 + halfTileSize, direction: "down" },
    { x: tileSize * 9 + halfTileSize, y: tileSize * 7 + halfTileSize, direction: "right" }, { x: tileSize * 11 + halfTileSize, y: tileSize * 7 + halfTileSize, direction: "up" },
    { x: tileSize * 11 + halfTileSize, y: tileSize + halfTileSize, direction: "right" }, endPoint];

// Movement tiles. Set up in order to prevent the player from placing any objects on them (going by path)
var movementTiles = [{ x: tileSize, y: 0 }, { x: tileSize * 2, y: 0 }, { x: tileSize, y: tileSize }, { x: tileSize * 2, y: tileSize }, { x: tileSize * 3, y: tileSize },
{ x: tileSize * 4, y: tileSize }, { x: tileSize * 5, y: tileSize }, { x: tileSize * 6, y: tileSize }, { x: tileSize * 7, y: tileSize }, { x: tileSize * 8, y: tileSize },
{ x: tileSize, y: tileSize * 2 }, { x: tileSize * 2, y: tileSize * 2 }, { x: tileSize * 3, y: tileSize * 2 }, { x: tileSize * 4, y: tileSize * 2 },
{ x: tileSize * 5, y: tileSize * 2 }, { x: tileSize * 6, y: tileSize * 2 }, { x: tileSize * 7, y: tileSize * 2 }, { x: tileSize * 8, y: tileSize * 2 },
{ x: tileSize * 7, y: tileSize * 3 }, { x: tileSize * 8, y: tileSize * 3 }, { x: tileSize * 7, y: tileSize * 4 }, { x: tileSize * 8, y: tileSize * 4 },
{ x: tileSize * 6, y: tileSize * 4 }, { x: tileSize * 5, y: tileSize * 4 }, { x: tileSize * 4, y: tileSize * 4 }, { x: tileSize * 3, y: tileSize * 4 },
{ x: tileSize * 2, y: tileSize * 4 }, { x: tileSize * 1, y: tileSize * 4 }, { x: tileSize * 8, y: tileSize * 5 }, { x: tileSize * 7, y: tileSize * 5 },
{ x: tileSize * 6, y: tileSize * 5 }, { x: tileSize * 5, y: tileSize * 5 }, { x: tileSize * 4, y: tileSize * 5 }, { x: tileSize * 3, y: tileSize * 5 },
{ x: tileSize * 2, y: tileSize * 5 }, { x: tileSize * 1, y: tileSize * 5 }, { x: tileSize * 1, y: tileSize * 6 }, { x: tileSize * 2, y: tileSize * 6 },
{ x: tileSize * 3, y: tileSize * 6 }, { x: tileSize * 4, y: tileSize * 6 }, { x: tileSize * 5, y: tileSize * 6 }, { x: tileSize * 6, y: tileSize * 6 },
{ x: tileSize * 7, y: tileSize * 6 }, { x: tileSize * 8, y: tileSize * 6 }, { x: tileSize * 9, y: tileSize * 6 }, { x: tileSize * 10, y: tileSize * 6 },
{ x: tileSize * 2, y: tileSize * 7 }, { x: tileSize * 1, y: tileSize * 7 }, { x: tileSize * 3, y: tileSize * 7 }, { x: tileSize * 4, y: tileSize * 7 },
{ x: tileSize * 5, y: tileSize * 7 }, { x: tileSize * 6, y: tileSize * 7 }, { x: tileSize * 7, y: tileSize * 7 }, { x: tileSize * 8, y: tileSize * 7 },
{ x: tileSize * 9, y: tileSize * 7 }, { x: tileSize * 10, y: tileSize * 7 }, { x: tileSize * 9, y: tileSize * 8 }, { x: tileSize * 10, y: tileSize * 8 },
{ x: tileSize * 11, y: tileSize * 8 }, { x: tileSize * 12, y: tileSize * 8 }, { x: tileSize * 11, y: tileSize * 7 }, { x: tileSize * 12, y: tileSize * 7 },
{ x: tileSize * 11, y: tileSize * 6 }, { x: tileSize * 11, y: tileSize * 5 }, { x: tileSize * 11, y: tileSize * 4 }, { x: tileSize * 11, y: tileSize * 3 },
{ x: tileSize * 11, y: tileSize * 2 }, { x: tileSize * 11, y: tileSize * 1 }, { x: tileSize * 12, y: tileSize * 7 }, { x: tileSize * 12, y: tileSize * 6 },
{ x: tileSize * 12, y: tileSize * 5 }, { x: tileSize * 12, y: tileSize * 4 }, { x: tileSize * 12, y: tileSize * 3 }, { x: tileSize * 12, y: tileSize * 2 },
{ x: tileSize * 12, y: tileSize * 1 }, { x: tileSize * 13, y: tileSize * 1 }, { x: tileSize * 13, y: tileSize * 2 }, { x: tileSize * 14, y: tileSize * 1 },
{ x: tileSize * 14, y: tileSize * 2 }, { x: tileSize * 15, y: tileSize * 1 }, { x: tileSize * 15, y: tileSize * 2 }];

// Obstalces creation
function createObstacles() {
    obstaclesArray = [{ type: 'obstacle', name: 'Small Tree', image: smallTreeImg, posX: 0, posY: tileSize * 2 },
    { type: 'obstacle', name: 'Small Tree', image: smallTreeImg, posX: 0, posY: tileSize * 4 },
    { type: 'obstacle', name: 'Small Tree', image: smallTreeImg, posX: tileSize * 6, posY: tileSize * 3 },
    { type: 'obstacle', name: 'Small Tree', image: smallTreeImg, posX: tileSize * 9, posY: tileSize * 4 },
    { type: 'obstacle', name: 'Small Tree', image: smallTreeImg, posX: tileSize * 10, posY: tileSize * 4 },
    { type: 'obstacle', name: 'Small Tree', image: smallTreeImg, posX: tileSize * 10, posY: tileSize * 5 },
    { type: 'obstacle', name: 'Small Tree', image: smallTreeImg, posX: tileSize * 14, posY: tileSize * 8 },
    { type: 'obstacle', name: 'Small Tree', image: smallTreeImg, posX: tileSize * 15, posY: tileSize * 7 },
    { type: 'obstacle', name: 'Big Tree', image: bigTreeImg, posX: 0, posY: 0 },
    { type: 'obstacle', name: 'Big Tree', image: bigTreeImg, posX: 0, posY: tileSize * 3 },
    { type: 'obstacle', name: 'Big Tree', image: bigTreeImg, posX: tileSize * 3, posY: 0 },
    { type: 'obstacle', name: 'Big Tree', image: bigTreeImg, posX: tileSize * 3, posY: tileSize * 8 },
    { type: 'obstacle', name: 'Big Tree', image: bigTreeImg, posX: tileSize * 8, posY: tileSize * 8 },
    { type: 'obstacle', name: 'Big Tree', image: bigTreeImg, posX: tileSize * 9, posY: tileSize * 5 },
    { type: 'obstacle', name: 'Big Tree', image: bigTreeImg, posX: tileSize * 13, posY: 0 },
    { type: 'obstacle', name: 'Big Tree', image: bigTreeImg, posX: tileSize * 13, posY: tileSize * 6 },
    { type: 'obstacle', name: 'Big Tree', image: bigTreeImg, posX: tileSize * 15, posY: tileSize * 8 }];
}

// Loading resources
function loadResources() {
    // Game background
    mapImg = new Image();
    mapImg.onload = resourceLoad();
    mapImg.src = "./images/full-map.png";
    mapImg.width = tileSize * 16;
    mapImg.height = tileSize * 9;

    // Main Menu image
    mainMenuImg = new Image();
    mainMenuImg.onload = resourceLoad();
    mainMenuImg.src = "./images/main-menu.png";
    mainMenuImg.width = tileSize * 16;
    mainMenuImg.height = tileSize * 9;

    // Instruction images
    for (var i = 1; i <= 3; i++) {
        var image = new Image();
        image.onload = resourceLoad();
        image.src = "./images/instructions-" + i + ".png";
        image.width = tileSize * 16;
        image.height = tileSize * 9;

        instructionImages.push(image);
    }

    // Pause image
    pauseImg = new Image();
    pauseImg.onload = resourceLoad();
    pauseImg.src = "./images/pause.png";
    pauseImg.width = tileSize * 16;
    pauseImg.height = tileSize * 9;

    // End game
    endScreenImg = new Image();
    endScreenImg.onload = resourceLoad();
    endScreenImg.src = "./images/endscreen.png";
    endScreenImg.width = tileSize * 16;
    endScreenImg.height = tileSize * 9;

    // 'Shadow' image
    shadowImg = new Image();
    shadowImg.onload = resourceLoad();
    shadowImg.src = "./images/shadow.png";
    shadowImg.width = tileSize * 16;
    shadowImg.height = tileSize * 9;

    // Buttons
    btnCancel = new Image();
    btnCancel.onload = resourceLoad();
    btnCancel.src = "./images/btn-cancel.png";
    btnCancel.width = tileSize * 3;
    btnCancel.height = tileSize;

    btnConfirm = new Image();
    btnConfirm.onload = resourceLoad();
    btnConfirm.src = "./images/btn-confirm.png";
    btnConfirm.width = tileSize * 3;
    btnConfirm.height = tileSize;

    btnInstructions = new Image();
    btnInstructions.onload = resourceLoad();
    btnInstructions.src = "./images/btn-instructions.png";
    btnInstructions.width = tileSize * 3;
    btnInstructions.height = tileSize;

    btnRestart = new Image();
    btnRestart.onload = resourceLoad();
    btnRestart.src = "./images/btn-restart.png";
    btnRestart.width = tileSize * 3;
    btnRestart.height = tileSize;

    btnStart = new Image();
    btnStart.onload = resourceLoad();
    btnStart.src = "./images/btn-start.png";
    btnStart.width = tileSize * 3;
    btnStart.height = tileSize;

    btnNext = new Image();
    btnNext.onload = resourceLoad();
    btnNext.src = "./images/btn-next.png";
    btnNext.width = tileSize * 3;
    btnNext.height = tileSize;

    btnPrev = new Image();
    btnPrev.onload = resourceLoad();
    btnPrev.src = "./images/btn-previous.png";
    btnPrev.width = tileSize * 3;
    btnPrev.height = tileSize;

    btnResume = new Image();
    btnResume.onload = resourceLoad();
    btnResume.src = "./images/btn-resume.png";
    btnResume.width = tileSize * 3;
    btnResume.height = tileSize;

    // Obstacles
    smallTreeImg = new Image();
    smallTreeImg.onload = resourceLoad();
    smallTreeImg.src = "./images/tree-small.png";
    smallTreeImg.width = tileSize;
    smallTreeImg.height = tileSize;

    bigTreeImg = new Image();
    bigTreeImg.onload = resourceLoad();
    bigTreeImg.src = "./images/tree-big.png";
    bigTreeImg.width = tileSize;
    bigTreeImg.height = tileSize;

    // Enemies
    tank1Img = new Image();
    tank1Img.onload = resourceLoad();
    tank1Img.src = "./images/tank-1.png";
    tank1Img.width = tileSize;
    tank1Img.height = tileSize;

    tank2Img = new Image();
    tank2Img.onload = resourceLoad();
    tank2Img.src = "./images/tank-2.png";
    tank2Img.width = tileSize;
    tank2Img.height = tileSize;

    soldier1Img = new Image();
    soldier1Img.onload = resourceLoad();
    soldier1Img.src = "./images/soldier-1.png";
    soldier1Img.width = tileSize;
    soldier1Img.height = tileSize;

    soldier2Img = new Image();
    soldier2Img.onload = resourceLoad();
    soldier2Img.src = "./images/soldier-2.png";
    soldier2Img.width = tileSize;
    soldier2Img.height = tileSize;

    // Enemies' ammunition
    ammo1Img = new Image();
    ammo1Img.onload = resourceLoad();
    ammo1Img.src = "./images/bullet-small.png";
    ammo1Img.width = tileSize;
    ammo1Img.height = tileSize;

    ammo2Img = new Image();
    ammo2Img.onload = resourceLoad();
    ammo2Img.src = "./images/bullet-big.png";
    ammo2Img.width = tileSize;
    ammo2Img.height = tileSize;

    ammo3Img = new Image();
    ammo3Img.onload = resourceLoad();
    ammo3Img.src = "./images/rocket-small.png";
    ammo3Img.width = tileSize;
    ammo3Img.height = tileSize;

    ammo4Img = new Image();
    ammo4Img.onload = resourceLoad();
    ammo4Img.src = "./images/rocket-big.png";
    ammo4Img.width = tileSize;
    ammo4Img.height = tileSize;

    // Reload image
    reloadImg = new Image();
    reloadImg.onload = resourceLoad();
    reloadImg.src = "./images/reload.png";
    reloadImg.width = tileSize;
    reloadImg.height = tileSize;

    // Player Objects
    lifeImg = new Image();
    lifeImg.onload = resourceLoad();
    lifeImg.src = "./images/life.png";
    lifeImg.width = halfTileSize;
    lifeImg.height = halfTileSize;

    objBaseImg = new Image();
    objBaseImg.onload = resourceLoad();
    objBaseImg.src = "./images/object-base.png";
    objBaseImg.width = tileSize;
    objBaseImg.height = tileSize;

    obj1Img = new Image();
    obj1Img.onload = resourceLoad();
    obj1Img.src = "./images/object-1.png";
    obj1Img.width = tileSize;
    obj1Img.height = tileSize;

    obj2Img = new Image();
    obj2Img.onload = resourceLoad();
    obj2Img.src = "./images/object-2.png";
    obj2Img.width = tileSize;
    obj2Img.height = tileSize;

    obj2ImgEmpty = new Image();
    obj2ImgEmpty.onload = resourceLoad();
    obj2ImgEmpty.src = "./images/object-2-empty.png";
    obj2ImgEmpty.width = tileSize;
    obj2ImgEmpty.height = tileSize;

    obj3Img = new Image();
    obj3Img.onload = resourceLoad();
    obj3Img.src = "./images/object-3.png";
    obj3Img.width = tileSize;
    obj3Img.height = tileSize;

    obj3ImgEmpty = new Image();
    obj3ImgEmpty.onload = resourceLoad();
    obj3ImgEmpty.src = "./images/object-3-empty.png";
    obj3ImgEmpty.width = tileSize;
    obj3ImgEmpty.height = tileSize;

    obj4Img = new Image();
    obj4Img.onload = resourceLoad();
    obj4Img.src = "./images/object-4.png";
    obj4Img.width = tileSize;
    obj4Img.height = tileSize;

    obj4ImgEmpty = new Image();
    obj4ImgEmpty.onload = resourceLoad();
    obj4ImgEmpty.src = "./images/object-4-empty.png";
    obj4ImgEmpty.width = tileSize;
    obj4ImgEmpty.height = tileSize;

    obj5Img = new Image();
    obj5Img.onload = resourceLoad();
    obj5Img.src = "./images/object-5.png";
    obj5Img.width = tileSize;
    obj5Img.height = tileSize;

    obj6Img = new Image();
    obj6Img.onload = resourceLoad();
    obj6Img.src = "./images/object-6.png";
    obj6Img.width = tileSize;
    obj6Img.height = tileSize;

    rangeImg = new Image();
    rangeImg.onload = resourceLoad();
    rangeImg.src = "./images/range-circle.svg";
    rangeImg.width = tileSize;
    rangeImg.height = tileSize;

    // Prohibited image
    prohibitedImg = new Image();
    prohibitedImg.onload = resourceLoad();
    prohibitedImg.src = "./images/prohibited.png";
    prohibitedImg.width = tileSize;
    prohibitedImg.height = tileSize;

    // Rockets' fire effect
    rocketFlameImg = new Image();
    rocketFlameImg.onload = resourceLoad();
    rocketFlameImg.src = "./images/rocket-flame.png";
    rocketFlameImg.width = tileSize;
    rocketFlameImg.height = tileSize;

    // Side menu
    menuExpandImg = new Image();
    menuExpandImg.onload = resourceLoad();
    menuExpandImg.src = "./images/menu-expand-btn.png";
    menuExpandImg.width = halfTileSize;
    menuExpandImg.height = halfTileSize;

    menuHideImg = new Image();
    menuHideImg.onload = resourceLoad();
    menuHideImg.src = "./images/menu-hide-btn.png";
    menuHideImg.width = halfTileSize;
    menuHideImg.height = halfTileSize;

    menuFullImg = new Image();
    menuFullImg.onload = resourceLoad();
    menuFullImg.src = "./images/menu-expanded.png";
    menuFullImg.width = tileSize * 2;
    menuFullImg.height = tileSize * 9;

    menuSelectImg = new Image();
    menuSelectImg.onload = resourceLoad();
    menuSelectImg.src = "./images/menu-selection.png";
    menuSelectImg.width = tileSize * 2;
    menuSelectImg.height = tileSize;

    // Pop up box
    popUpImg = new Image();
    popUpImg.onload = resourceLoad();
    popUpImg.src = "./images/popup.png";
    popUpImg.width = tileSize * 12;
    popUpImg.height = tileSize * 8;

    // Special effects
    // Tank explosion images
    for (var i = 1; i <= 3; i++) {
        var image = new Image();
        image.onload = resourceLoad();
        image.src = "./images/tank-explosion-" + i + ".png";
        image.width = tileSize;
        image.height = tileSize;

        tankExplosionImgArray.push(image);
    }

    // Rocket explosion images
    for (var i = 1; i <= 3; i++) {
        var image = new Image();
        image.onload = resourceLoad();
        image.src = "./images/rocket-explosion-" + i + ".png";
        image.width = tileSize;
        image.height = tileSize;

        rocketExplosionImgArray.push(image);
    }

    // Audio
    clickSound = new Audio;
    clickSound.onload = resourceLoad();
    clickSound.src = "./audio/click.ogg";

    selectSound = new Audio;
    selectSound.onload = resourceLoad();
    selectSound.src = "./audio/select.ogg";

    backgroundMusic = new Audio();
    backgroundMusic.onload = resourceLoad();
    backgroundMusic.src = "./audio/bg-music.mp3";

    explosionSound = new Audio();
    explosionSound.onload = resourceLoad();
    explosionSound.src = "./audio/explosion.flac";

    shot1Sound = new Audio();
    shot1Sound.onload = resourceLoad();
    shot1Sound.src = "./audio/shot-1.mp3";

    shot2Sound = new Audio();
    shot2Sound.onload = resourceLoad();
    shot2Sound.src = "./audio/shot-2.mp3";

    shot3Sound = new Audio();
    shot3Sound.onload = resourceLoad();
    shot3Sound.src = "./audio/shot-3.mp3";
}

// Checks if all resources have been loaded.
function resourceLoad() {
    currentResource++;
    // If all resources have been loaded starting the update() method.
    if (currentResource == resourcesToLoad) {
        // console.log("All resources loaded");
        update();
    }
}
