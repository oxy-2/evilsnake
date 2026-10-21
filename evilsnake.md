i am making this small project for wrong tool, cuz i want a retro handheld.

evilsnake, is maybe arguable on the evil part, but basically its snake in google sheets:


# repo
so ima just give a tutorial on how to like make the appscript thing and then im gonan give a google sheet copy and the code as files in the rpo and ill check it works on a random computer too but yeah that should be good.

# design
ima just do it with like functions in cells, i think conditional formatting for dark green snake body, a darker green head, a green background like sonic grass green yk, and then red fruits, i use conditonal formatting for this on a 20x20 grid, so then i just need two things: ***a clock*** and ***an ALU*** by alu i just mean the full complex system to do the arithmetic also lastly i need a way to update numbers on the grid like a ***driver***. 

with the general idea now down lemme figure these out, starting at clock, then driver and lastly alu.

## the clock:
sadly we need appscript, i will make the clock appscript and it will go back to once cell that updates every like 1 second, then the game will be 1hz, yes one hz snake, i know its atrocious but i do what i can.


## the driver
this is more so sum i need to spend time in sheets just figuring out but what i want is a way to have a calculation done in which maybe a 3 digit value is given, the last value, 0 to 3 determines, background, fruit, snake, snakehead and then the first 2 digits are the cell to be selected from underneath the driver cell.

it would be like a 20x20 grid and above the top row of this grid is the driver cells for each, which does mean it would be rolling, actually shit i need like OKAY NEVER MIND IM DOING 9x10, i need driver cells for each cell so ill have a playable grid and then i need a driver grid too beside it, then the alu is after that to the side, and then lastly is the clock which sits in the alu.

OH ACTUALLY, i can just run the like driver cells as the damn display, then it just has to be one value and i put conditional formatting on the grid and then they are the screen and just get updated by tha alu somehow, i think i need a driver for my uh display, back at square one perhaps, okay alu outputs 10 9 digit numbers a second like in parrallel or 90 then those either if 10 numbers they get mathed into 9 individual ordered numbers to go to the display or if its 90 then well its 90,

## the alu



```javascript
function playSnake() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  // Game Configuration
  var ROWS = 10;
  var COLS = 9;
  
  // Initialize game state variables
  var snake = [[4, 4], [4, 5], [4, 6]]; // Head is at index 0 [row, col]
  var direction = "UP";
  var fruit =;
  
  // Run the loop for roughly 5 minutes (300 ticks at 1Hz)
  for (var tick = 0; tick < 300; tick++) {
    
    // 1. Fetch Player Input from cell W1
    var inputCell = sheet.getRange("W1");
    var userInput = inputCell.getValue().toString().toLowerCase().trim();
    
    // Change direction based on input (preventing 180-degree self-crashing)
    if (userInput === 'w' && direction !== "DOWN") direction = "UP";
    if (userInput === 's' && direction !== "UP")   direction = "DOWN";
    if (userInput === 'a' && direction !== "RIGHT") direction = "LEFT";
    if (userInput === 'd' && direction !== "LEFT")  direction = "RIGHT";
    
    // Clear input cell so it's ready for the next move
    inputCell.setValue(""); 
    
    // 2. Calculate New Head Position
    var head = snake[0];
    var newHead = [head[0], head[1]];
    
    if (direction === "UP")    newHead[0]--;
    if (direction === "DOWN")  newHead[0]++;
    if (direction === "LEFT")  newHead[1]--;
    if (direction === "RIGHT") newHead[1]++;
    
    // 3. Collision Checks (Walls or Self)
    var hitWall = (newHead[0] < 0 || newHead[0] >= ROWS || newHead[1] < 0 || newHead[1] >= COLS);
    var hitSelf = snake.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1]);
    
    if (hitWall || hitSelf) {
      // Game Over Visual: Flash screen with an error string or write message
      sheet.getRange("U1").setValue("999999999");
      return; 
    }
    
    // Add new head to snake array
    snake.unshift(newHead);
    
    // 4. Check if Fruit was Eaten
    if (newHead[0] === fruit[0] && newHead[1] === fruit[1]) {
      // Spawn a new random fruit
      fruit = [Math.floor(Math.random() * ROWS), Math.floor(Math.random() * COLS)];
    } else {
      // Remove tail segment if fruit wasn't eaten
      snake.pop();
    }
    
    // 5. Render & Encode Grid to 9-Digit Strings
    var dataStrings = [];
    for (var r = 0; r < ROWS; r++) {
      var rowStr = "";
      for (var c = 0; c < COLS; c++) {
        if (snake[0][0] === r && snake[0][1] === c) {
          rowStr += "2"; // Head
        } else if (snake.some(seg => seg[0] === r && seg[1] === c)) {
          rowStr += "1"; // Body
        } else if (fruit[0] === r && fruit[1] === c) {
          rowStr += "3"; // Fruit
        } else {
          rowStr += "0"; // Empty Grass
        }
      }
      dataStrings.push([rowStr]); // Apps Script requires 2D array format for rows
    }
    
    // 6. Write Strings into Column U & Force Flush UI
    sheet.getRange(1, 21, ROWS, 1).setValues(dataStrings); // 21 is Column U
    SpreadsheetApp.flush(); 
    
    // Pace the loop at exactly 1Hz (1000ms delay)
    Utilities.sleep(1000);
  }
}

```