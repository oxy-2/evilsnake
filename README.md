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

OH ACTUALLY, i can just run the like driver cells as the damn display, then it just has to be one value and i put conditional formatting on the grid and then they are the screen and just get updated by tha alu somehow, i think i need a driver for my uh display, back at square one perhaps, okay alu outputs 10 9 digit numbers a second like in parrallel or 90 then those either if 10 numbers they get mathed into 9 individual ordered numbers to go to the display or if its 90 then well its 90




HIII OKAY I FINISHED IT, its like a server simulation and it then sends hex hich is decoded into 10 numbers, 10 digits per number, with one as the number header so like 1000000000, would be a full column of grass cuz zero is grass, anyways 1 is apple, 2 is snake head, anything else is snake body

ALSO uh the game kinda dies after a couple fruits, cuz like the hex and decoding, the sim is perfectly fine, as long as u are fine with a multicolored apple snake go ahead i suppose lol, anyways im tired ash and thats abt it, have fun!!

oh yeah uh how to run it, download the sheet, go to extensions, go the the js thing and paste in the code.gs contents in there and save it, then you just gotta click up at the top bar start server, or sum and it should give a button for start, click that and now when u type in the big gray play button cell it takes u to the game sheet, type w, a, s and d to control the snake, type them in the yellow cell and also yeah i left the numbers unhidden incase u wanan see em, HAVE FUN BYEEE!!!



made with love
by oxy <3