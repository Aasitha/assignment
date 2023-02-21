var readline = require('readline'),
    menu;

// Main
function showMain() {
    // Clear screen
    process.stdout.write('\033c');

    // Log the menu
    console.log(
        'Main menu\n\n' +
        '1 = Go to sub\n' +
        '2 = Can be another sub... For now same as option 1\n' +
        '3 = Exit'
        );

    // Check if there is already a menu active. If true, close it.
    if(menu) menu.close();

    //Creates a readline Interface instance
    menu = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Ask question
    menu.question('Where to go? ', function(input) {
        switch(input) {
            case '1': showSub(); break;
            case '2': showSub(); break;
            case '3': process.exit(); break;
            default: showMain() /* show menu again if input does not match */;
        }
    });
}

// Sub
function showSub() {
    // Clear screen
    process.stdout.write('\033c');

    // Log the menu
    console.log(
        'Sub menu\n\n' +
        '1 = Another sub blabla...\n' +
        '2 = Go back to main'
        );

    // Check if there is already a menu active. If true, close it.
    if(menu) menu.close();

    // Creates a readline Interface instance
    menu = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Ask question
    menu.question('Where to go? ', function(input) {
        switch(input) {
            case '1': console.log('Another sub blabla...'); break;
            case '2': showMain(); break;
            default: showSub() /* show menu again if input does not match */;
        }
    });
}

showMain();
