// Returns the coordinates of the game canvas. 
function getCoords(elID) {
    var box = document.getElementById(elID).getBoundingClientRect();
    var body = document.body;
    var docEle = document.documentElement;

    var scrollTop = window.pageYOffset || docEle.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEle.scrollLeft || body.scrollLeft;

    var clientTop = docEle.clientTop || body.clientTop || 0;
    var clientLeft = docEle.clientLeft || body.clientLeft || 0;

    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}

// Returns the (0,0) coordinates of a tile for passed position
function getTileCoords(posX, posY) {

    var calcPosX = Math.floor(posX / tileSize) * tileSize;
    var calcPosY = Math.floor(posY / tileSize) * tileSize;

    return { x: calcPosX, y: calcPosY };
}

// Executes events depending on player's touch / click and current state (e.g. expanded menu)
function touchRaycast(e) {
    var coords = getCoords('game-canvas');
    var raycasted = false;

    // Getting the position of the touch / click on the canvas
    var posX = e.pageX - coords.left || e.touches[0].pageX - coords.left;
    var posY = e.pageY - coords.top || e.touches[0].pageY - coords.top;

    switch (currScene) {
        case "menu":
            // Checking if Start or Instructions button have been pressed
            if (posX >= canvas.width / 2 - btnStart.width / 2 && posX <= canvas.width / 2 - btnStart.width / 2 + btnStart.width &&
                posY >= canvas.height / 2 && posY <= canvas.height / 2 + btnStart.height) {
                playClickSound();
                startGame();
            } else if (posX >= canvas.width / 2 - btnInstructions.width / 2 && posX <= canvas.width / 2 - btnInstructions.width / 2 + btnInstructions.width &&
                posY >= canvas.height / 2 + btnInstructions.height + halfTileSize && posY <= canvas.height / 2 + btnInstructions.height + halfTileSize + btnInstructions.height) {
                playClickSound();
                showInstructions();
            }
            break;
        case "instructions":
            // Checking current page
            if (currInstrPage == 1) {
                // Checking if Next button has been pressed
                if (posX >= canvas.width / 2 + tileSize / 4 && posX <= canvas.width / 2 + tileSize / 4 + btnNext.width &&
                    posY >= canvas.height - btnNext.height - tileSize / 4 && posY <= canvas.height - btnNext.height - tileSize / 4 + btnNext.height) {
                    playClickSound();
                    currInstrPage++;
                }
            } else if (currInstrPage == 2) {
                // Checking if Next or Previous button has been pressed
                if (posX >= canvas.width / 2 + tileSize / 4 && posX <= canvas.width / 2 + tileSize / 4 + btnNext.width &&
                    posY >= canvas.height - btnNext.height - tileSize / 4 && posY <= canvas.height - btnNext.height - tileSize / 4 + btnNext.height) {
                    playClickSound();
                    currInstrPage++;
                } else if (posX >= canvas.width / 2 - btnPrev.width - tileSize / 4 && posX <= canvas.width / 2 - btnPrev.width - tileSize / 4 + btnPrev.width &&
                    posY >= canvas.height - btnPrev.height - tileSize / 4 && posY <= canvas.height - btnPrev.height - tileSize / 4 + btnPrev.height) {
                    playClickSound();
                    currInstrPage--;
                }
            } else if (currInstrPage == 3) {
                // Checking if Start or Previous button has been pressed
                if (posX >= canvas.width / 2 + tileSize / 4 && posX <= canvas.width / 2 + tileSize / 4 + btnStart.width &&
                    posY >= canvas.height - btnStart.height - tileSize / 4 && posY <= canvas.height - btnStart.height - tileSize / 4 + btnStart.height) {
                    playClickSound();
                    currInstrPage = 1;
                    startGame();
                } else if (posX >= canvas.width / 2 - btnPrev.width - tileSize / 4 && posX <= canvas.width / 2 - btnPrev.width - tileSize / 4 + btnPrev.width &&
                    posY >= canvas.height - btnPrev.height - tileSize / 4 && posY <= canvas.height - btnPrev.height - tileSize / 4 + btnPrev.height) {
                    playClickSound();
                    currInstrPage--;
                }
            }
            break;
        case "game":
            if (pausedGame) {
                // Check if Resume button was pressed
                if (posX >= canvas.width / 2 - btnResume.width / 2 && posX <= canvas.width / 2 - btnResume.width / 2 + btnResume.width &&
                    posY >= canvas.height / 2 && posY <= canvas.height / 2 + btnResume.height) {
                    playClickSound();
                    // Resetting selections
                    selectedMenuObject = false;
                    obstacleRemoverSelected = false;
                    objToRemove = null;
                    pausedGame = false;
                }
                return;
            }

            if (showRemoveConfirmation) {
                // Checking if Cancel or Confirm button was pressed
                if (posX >= canvas.width / 2 - btnCancel.width - btnCancel.width / 2 && posX <= canvas.width / 2 - btnCancel.width - btnCancel.width / 2 + btnCancel.width &&
                    posY >= canvas.height / 2 + popUpImg.height / 4 && posY <= canvas.height / 2 + popUpImg.height / 4 + btnCancel.height) {
                    playClickSound();
                    showRemoveConfirmation = false;
                    objToRemove = null;
                } else if (posX >= canvas.width / 2 + btnConfirm.width / 2 && posX <= canvas.width / 2 + btnConfirm.width / 2 + btnConfirm.width &&
                    posY >= canvas.height / 2 + popUpImg.height / 4 && posY <= canvas.height / 2 + popUpImg.height / 4 + btnConfirm.height) {
                    playClickSound();

                    // Checking if the player has enough money to remove the object
                    if (money >= obstacleRemovePrice) {
                        removeObject(objToRemove);

                        // Not showing range for that object anymore.
                        selectedMapObject = null;
                    }
                    else {
                        // Shaking money and displaying information for the player if not enough money
                        shakeMoneyAnimation(false);
                        infoText = "Not enough money to remove this object.";
                        infoTextTimer = 3 * 1000;
                    }

                    // Hiding confirmation
                    showRemoveConfirmation = false;

                    // Resetting the object to remove and remover selection
                    objToRemove = null;
                    obstacleRemoverSelected = false;

                    // Resetting menu selection
                    menuSelectedRow = 0;
                    selectedMenuObject = false;
                }
                return;
            }

            // Getting clicked tile
            var tileCoords = getTileCoords(posX, posY);

            var menuClicked = false;
            // Checking if menu is expanded
            if (menuExpanded) {
                // Checking if player pressed on hide menu button
                if (posX >= canvas.width - menuFullImg.width - menuHideImg.width && posX <= canvas.width - menuFullImg.width &&
                    posY <= menuHideImg.height) {
                    playClickSound();
                    menuExpanded = false;
                    raycasted = true;
                    menuClicked = true;
                }
                else {
                    // Checking if the player selected an object in the menu
                    if (posX >= canvas.width - menuFullImg.width) {
                        playClickSound();
                        var clickedRow = posY / tileSize;

                        // Getting selected object
                        selectedMenuObject = true;
                        var newSelectedRow = Math.floor(clickedRow) + 1;

                        if (newSelectedRow < 7) {
                            obstacleRemoverSelected = false;
                        } else if (newSelectedRow == 7) {
                            obstacleRemoverSelected = true;
                            selectedMapObject = null;
                        } else if (newSelectedRow == 8) {
                            pausedGame = true;
                        } else if (newSelectedRow > 8) {
                            selectedMenuObject = false;
                        }

                        // If the same row has been selected, removing the selection
                        if (newSelectedRow == menuSelectedRow) {
                            selectedMenuObject = false;
                            obstacleRemoverSelected = false;
                            menuSelectedRow = 0;
                        }
                        else {
                            menuSelectedRow = newSelectedRow;
                        }

                        raycasted = true;
                        menuClicked = true;
                    }
                }
            }
            else {
                // Checking if the expand button has been pressed
                if (posX >= canvas.width - menuExpandImg.width && posY <= menuExpandImg.height) {
                    playClickSound();
                    menuExpanded = true;
                    raycasted = true;
                    menuClicked = true;
                }
            }

            // Creating the object only if the menu wasn't clicked (resolving issue with building unintentionally behind the menu)
            if (menuClicked == false) {
                if (selectedMenuObject && obstacleRemoverSelected == false) {
                    playSelectSound();
                    createObjectOnMap(tileCoords.x, tileCoords.y, menuSelectedRow);
                    selectedMenuObject = false;
                    menuSelectedRow = 0;
                }
            }

            // Checking if an object was pressed
            for (var i = 0; i < playerObjArray.length; i++) {
                if (playerObjArray[i].posX == tileCoords.x && playerObjArray[i].posY == tileCoords.y) {
                    playSelectSound();
                    selectedMapObject = playerObjArray[i];
                    raycasted = true;
                    break;
                }
            }

            // Checking if an obstacle was pressed
            for (var i = 0; i < obstaclesArray.length; i++) {
                if (obstaclesArray[i].posX == tileCoords.x && obstaclesArray[i].posY == tileCoords.y) {
                    playSelectSound();
                    selectedMapObject = obstaclesArray[i];
                    raycasted = true;
                    break;
                }
            }

            // If an object has been selected using the remover displaying confirmation
            if (selectedMapObject && obstacleRemoverSelected) {
                showRemoveConfirmation = true;
                objToRemove = selectedMapObject;
            }

            if (raycasted == false) {
                selectedMapObject = null;
            }
            break;
        case "end":
            // Checking if Restart button has been pressed
            if (posX >= canvas.width / 2 - btnRestart.width / 2 && posX <= canvas.width / 2 - btnRestart.width / 2 + btnRestart.width &&
                posY >= canvas.height - btnRestart.height - tileSize / 4 && posY <= canvas.height - btnRestart.height - tileSize / 4 + btnRestart.height) {
                playClickSound();
                restartGame();
            }
            break;
        default:
            break;
    }
}