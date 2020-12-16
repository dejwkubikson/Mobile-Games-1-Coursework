// Button click sound
var clickSound;
// Object select sound
var selectSound;
// Background music
var backgroundMusic;
// Explosions sound
var explosionSound;
// Player's object shot sounds
var shot1Sound;
var shot2Sound;
var shot3Sound;

// Plays background music. Toggled on game start.
function playBackgroundMusic() {
    backgroundMusic.play();
}

// Pauses background music. Toggled when in pause screen.
function pauseBackgroundMusic() {
    backgroundMusic.pause();
}

// Plays click sound.
function playClickSound() {
    var audio = new Audio();
    audio = clickSound;
    audio.play();
}

// Plays select sound.
function playSelectSound() {
    var audio = new Audio();
    audio = selectSound;
    audio.play();
}

// Plays shot sound.
function playShotSound(shotSound) {
    var audio = new Audio();
    audio = shotSound;
    audio.play();
}

// Plays tank's explosion sound.
function playExplosionSound() {
    var audio = new Audio();
    audio = explosionSound;
    audio.play();
}