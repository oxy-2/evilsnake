var total_grid_rows = 9;

var total_grid_cols = 10;

  

// on open parts

function onOpen() {

SpreadsheetApp.getUi()

.createMenu('start snake server')

.addItem('start', 'forceResetFromMenu')

.addToUi();

}

  

// go to game sheet and reset

function forceResetFromMenu() {

var activeGoogleSpreadsheetInstance = SpreadsheetApp.getActiveSpreadsheet();

var targetGameWorksheet = activeGoogleSpreadsheetInstance.getSheetByName("game");

if (targetGameWorksheet) {

initializeNewGame(targetGameWorksheet);

}

}

  

// event stuff

function onEdit(e) {

var activeGoogleSpreadsheetInstance = e.source;

var currentActiveWorksheet = activeGoogleSpreadsheetInstance.getActiveSheet();

var currentWorksheetNameString = currentActiveWorksheet.getName();

var selectedCellRangeObject = e.range;

var enteredCellStringValue = e.value ? e.value.toLowerCase() : "";

  

if (currentWorksheetNameString === "title" && selectedCellRangeObject.getA1Notation() === "G15") {

// reset title

currentActiveWorksheet.getRange("G15:H17").setValue("Play");

SpreadsheetApp.flush();

// go to game

var targetGameWorksheet = activeGoogleSpreadsheetInstance.getSheetByName("game");

if (targetGameWorksheet) {

activeGoogleSpreadsheetInstance.setActiveSheet(targetGameWorksheet);

initializeNewGame(targetGameWorksheet);

}

return;

}

  

if (currentWorksheetNameString === "game" && selectedCellRangeObject.getA1Notation() === "M3" && enteredCellStringValue !== "") {

runGameTick(currentActiveWorksheet, enteredCellStringValue);

selectedCellRangeObject.setValue("");

SpreadsheetApp.flush();

}

}

  

// game initialization

function initializeNewGame(targetWorksheet) {

targetWorksheet.getRange("M2").setValue("");

targetWorksheet.getRange("M11").setValue(1);

targetWorksheet.getRange("M3").setValue("");

SpreadsheetApp.flush();

var defaultInitialGameStateObject = {

snake: [{x: 5, y: 4}, {x:5, y:5}],

dir: {x: 0, y: -1},

food: {x: 3, y: 3},

score: 0,

isDead: false

};

PropertiesService.getDocumentProperties().setProperty("SNAKE_STATE", JSON.stringify(defaultInitialGameStateObject));

renderStateToHex(targetWorksheet, defaultInitialGameStateObject);

}

  

//movememnt

function runGameTick(targetWorksheet, movememntInputDirectionString) {

var documentPropertiesServiceInstance = PropertiesService.getDocumentProperties();

var serializedGameStateString = documentPropertiesServiceInstance.getProperty("SNAKE_STATE");

if (!serializedGameStateString) return;

var currentGameStateObject = JSON.parse(serializedGameStateString);

if (currentGameStateObject.isDead) return;

//no eat self

if (movememntInputDirectionString === "w" && currentGameStateObject.dir.y === 0) currentGameStateObject.dir = {x: 0, y: -1};

if (movememntInputDirectionString === "a" && currentGameStateObject.dir.x === 0) currentGameStateObject.dir = {x: -1, y: 0};

if (movememntInputDirectionString === "s" && currentGameStateObject.dir.y === 0) currentGameStateObject.dir = {x: 0, y: 1};

if (movememntInputDirectionString === "d" && currentGameStateObject.dir.x === 0) currentGameStateObject.dir = {x: 1, y: 0};

var previousSnakeHeadCoordinates = currentGameStateObject.snake[0];

var calculatedNewSnakeHeadCoordinates = {

x: previousSnakeHeadCoordinates.x + currentGameStateObject.dir.x,

y: previousSnakeHeadCoordinates.y + currentGameStateObject.dir.y

};

// wall

if (calculatedNewSnakeHeadCoordinates.x < 1 || calculatedNewSnakeHeadCoordinates.x > total_grid_cols || calculatedNewSnakeHeadCoordinates.y < 1 || calculatedNewSnakeHeadCoordinates.y > total_grid_rows) {

triggerGameOver(targetWorksheet);

return;

}

for (var snakeSegmentIndex = 0; snakeSegmentIndex < currentGameStateObject.snake.length; snakeSegmentIndex++) {

if (currentGameStateObject.snake[snakeSegmentIndex].x === calculatedNewSnakeHeadCoordinates.x && currentGameStateObject.snake[snakeSegmentIndex].y === calculatedNewSnakeHeadCoordinates.y) {

triggerGameOver(targetWorksheet);

return;

}

}

currentGameStateObject.snake.unshift(calculatedNewSnakeHeadCoordinates);

if (calculatedNewSnakeHeadCoordinates.x === currentGameStateObject.food.x && calculatedNewSnakeHeadCoordinates.y === currentGameStateObject.food.y) {

currentGameStateObject.score += 10;

currentGameStateObject.food = spawnNewFood(currentGameStateObject.snake);

} else {

currentGameStateObject.snake.pop();

}

documentPropertiesServiceInstance.setProperty("SNAKE_STATE", JSON.stringify(currentGameStateObject));

renderStateToHex(targetWorksheet, currentGameStateObject);

}

  

function spawnNewFood(snakeBodySegmentArray) {

var randomizedNewFoodCoordinates;

var isCoordinatesOccupiedBySnakeFlag = true;

while (isCoordinatesOccupiedBySnakeFlag) {

randomizedNewFoodCoordinates = {

x: Math.floor(Math.random() * total_grid_cols) + 1,

y: Math.floor(Math.random() * total_grid_rows) + 1

};

isCoordinatesOccupiedBySnakeFlag = false;

for (var validationIndex = 0; validationIndex < snakeBodySegmentArray.length; validationIndex++) {

if (snakeBodySegmentArray[validationIndex].x === randomizedNewFoodCoordinates.x && snakeBodySegmentArray[validationIndex].y === randomizedNewFoodCoordinates.y) {

isCoordinatesOccupiedBySnakeFlag = true;

break;

}

}

}

return randomizedNewFoodCoordinates;

}

  

function renderStateToHex(targetWorksheet, currentGameStateObject) {

var twoDimensionalGridDisplayMatrix = [];

for (var gridRowIndex = 0; gridRowIndex < total_grid_rows; gridRowIndex++) {

twoDimensionalGridDisplayMatrix[gridRowIndex] = [];

for (var gridColumnIndex = 0; gridColumnIndex < total_grid_cols; gridColumnIndex++) {

twoDimensionalGridDisplayMatrix[gridRowIndex][gridColumnIndex] = 0;

}

}

if (currentGameStateObject.food.y >= 1 && currentGameStateObject.food.y <= total_grid_rows && currentGameStateObject.food.x >= 1 && currentGameStateObject.food.x <= total_grid_cols) {

twoDimensionalGridDisplayMatrix[currentGameStateObject.food.y - 1][currentGameStateObject.food.x - 1] = 1;

}

//snake head

if (currentGameStateObject.snake && currentGameStateObject.snake[0] && currentGameStateObject.snake[0].y >= 1 && currentGameStateObject.snake[0].x <= total_grid_cols) {

twoDimensionalGridDisplayMatrix[currentGameStateObject.snake[0].y - 1][currentGameStateObject.snake[0].x - 1] = 2;

}

// snake body

for (var segmentLoopIndex = 1; segmentLoopIndex < currentGameStateObject.snake.length; segmentLoopIndex++) {

var currentSnakeBodySegmentCoordinate = currentGameStateObject.snake[segmentLoopIndex];

if (currentSnakeBodySegmentCoordinate && currentSnakeBodySegmentCoordinate.y >= 1 && currentSnakeBodySegmentCoordinate.y <= total_grid_rows && currentSnakeBodySegmentCoordinate.x >= 1 && currentSnakeBodySegmentCoordinate.x <= total_grid_cols) {

twoDimensionalGridDisplayMatrix[currentSnakeBodySegmentCoordinate.y - 1][currentSnakeBodySegmentCoordinate.x - 1] = 2 + segmentLoopIndex;

}

}

//hex thang

var accumulatedFinalHexidecialMasterString = "";

for (var gridColumnIndex = 0; gridColumnIndex < total_grid_cols; gridColumnIndex++) {

var concatenatedColumnDigitsString = "";

for (var gridRowIndex = 0; gridRowIndex < total_grid_rows; gridRowIndex++) {

concatenatedColumnDigitsString += twoDimensionalGridDisplayMatrix[gridRowIndex][gridColumnIndex].toString();

}

var parsedColumnIntegerNumber = parseInt(concatenatedColumnDigitsString, 10);

var paddedHexadecimalSegmentString = parsedColumnIntegerNumber.toString(16);

while (paddedHexadecimalSegmentString.length < 8) {

paddedHexadecimalSegmentString = "0" + paddedHexadecimalSegmentString;

}

accumulatedFinalHexidecialMasterString += paddedHexadecimalSegmentString;

}

targetWorksheet.getRange("M2").setValue(accumulatedFinalHexidecialMasterString);

}

  

// game over

function triggerGameOver(targetWorksheet) {

var activeGoogleSpreadsheetInstance = SpreadsheetApp.getActiveSpreadsheet();

var targetTitleWorksheet = activeGoogleSpreadsheetInstance.getSheetByName("title");

var documentPropertiesServiceInstance = PropertiesService.getDocumentProperties();

var serializedGameStateString = documentPropertiesServiceInstance.getProperty("SNAKE_STATE");

if (serializedGameStateString) {

var currentGameStateObject = JSON.parse(serializedGameStateString);

currentGameStateObject.isDead = true;

documentPropertiesServiceInstance.setProperty("SNAKE_STATE", JSON.stringify(currentGameStateObject));

Browser.msgBox("the very evil snake's tyranny over apple society has ended! Final Score: " + currentGameStateObject.score);

}

//reset

targetWorksheet.getRange("M2").setValue("");

targetWorksheet.getRange("M11").setValue(0);

SpreadsheetApp.flush();

targetWorksheet.getRange("M11").setValue(1);

SpreadsheetApp.flush();

if (targetTitleWorksheet) {

activeGoogleSpreadsheetInstance.setActiveSheet(targetTitleWorksheet);

}

}