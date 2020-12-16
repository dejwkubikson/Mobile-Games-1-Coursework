// Holds player's longest survival time
var playerBestTime = 0;
// Holds player's longest survival wave
var playerBestWave = 0;
// Used to check if player's best has been saved. Prevents from saving each frame.
var playerBestSaved = false;

// Saves players best survival time and wave at the end of the game.
function savePlayersBest(time, wave) {
    saveCookie('playerBestTime', time);
    saveCookie('playerBestWave', wave);
}

// Gets and assigns best survival time and wave at the begining of the game.
function assignPlayersBest() {
    playerBestTime = parseInt(readCookie('playerBestTime'));
    playerBestWave = parseInt(readCookie('playerBestWave'));

    // Checking if read values is a number. If not, setting it to 0.
    if (!isNaN(playerBestTime))
        playerBestTime = 0;
    if (!isNaN(playerBestWave))
        playerBestWave = 0;
}
