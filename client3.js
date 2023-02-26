const net = require('net');
var term = require("terminal-kit").terminal;
var term2 = require("terminal-kit").terminal;
var stdin = process.openStdin();
const prompt = require("prompt-sync")({ sigint: true });
var inquirer = require("inquirer");
var chalk = require("chalk");
var activeUsers = [];
var senderChat = false;
var receiverChat = false;
var quit = false;
var readLine = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});


var data = {

}

const loginQstns =

    [
        {
            type: "input",
            name: "username",
            message: chalk.greenBright.bold("Enter userame")

        }, {
            type: "password",
            name: "password",
            mask: "•",
            message: chalk.greenBright.bold("Enter password")
        }
    ]
const socket = net.connect({
    port: 1235
})
async function fun() {

    /* var prompt= await inquirer.prompt(loginQstns).then((answers) => {
         data.uname = answers.username;
         data.pass = answers.password
         data.command = 1;
         
         
 
     })*/
    data.uname = prompt("Enter username: ");
    data.pass = prompt("Enter password: ");
    data.command = 1;

    socket.write(JSON.stringify(data));


}
async function fun2() {

    /*var prompt=await inquirer.prompt(loginQstns).then((answers) => {
        data.uname = answers.username;
        data.pass = answers.password
        data.command = 2;
        

    })*/
    data.uname = prompt("Enter username: ");
    data.pass = prompt("Enter password: ");
    data.command = 2;

    socket.write(JSON.stringify(data));
}
async function viewActiveClients() {
    data.command = 3;
    socket.write(JSON.stringify(data));
}
async function requestToClients() {
    data.command = 0;
    socket.write(JSON.stringify(data));

}
async function acceptRequests() {
    data.command = -1;
    socket.write(JSON.stringify(data));
}


var whenInvalid = [
    "Retry",
    "Exit"
]
var afterRegister = [
    "Login",
    "Exit"
]
async function afterRegisterFunc() {
    var prompt = await inquirer.prompt([
        {
            type: "list",
            name: "opening options",
            choices: afterRegister
        }
    ]).then((answers) => {
        if (answers['opening options'] = "Login") {
            setTimeout(() => {
                term.clear();
                fun2();
            }, 2000);
        } else {
            process.exit();
        }
    })

}
async function whenInvalidFuncRegister() {
    await inquirer.prompt([
        {
            type: 'list',
            name: 'opening options',
            //message: 'Which is better?',
            choices: whenInvalid
        },
    ])
        .then(answers => {
            //console.log(answers)
            if (answers['opening options'] == "Retry") {
                fun();



            } else if (answers["opening options"] == "Exit") {
                process.exit();
            }

        });

}
async function whenInvalidFuncLogin() {
    await inquirer.prompt([
        {
            type: 'list',
            name: 'opening options',
            //message: 'Which is better?',
            choices: whenInvalid
        },
    ])
        .then(answers => {
            //console.log(answers)
            if (answers['opening options'] == "Retry") {
                fun2();



            } else if (answers["opening options"] == "Exit") {
                process.exit();
            }

        });

}

var tasks = [
    "view active clients",
    "start 1:1 session",
    "start group session",
    "view requests",
    "view groups",
    "create group",
    "Delete group",
    "Edit username and password",
    "Logout",
    "Exit"
]

async function task() {
    await inquirer.prompt([
        {
            type: 'list',
            name: 'opening options',

            choices: tasks
        },
    ])
        .then(answers => {
            //console.log(answers)
            if (answers['opening options'] == "view active clients") {
                setTimeout(() => {
                    term.clear();
                    viewActiveClients();
                }, 1000)
            } else if (answers["opening options"] == "start 1:1 session") {
                setTimeout(() => {
                    term.clear();
                    requestToClients();
                }, 1000)

            }
            else if (answers["opening options"] == "view requests") {
                setTimeout(() => {
                    term.clear();
                    acceptRequests();
                }, 1000)

            } else if (answers["opening options"] == "Logout") {
                data.command = "logout";
                socket.write(JSON.stringify(data));
            }else if(answers["opening options"]=="create group"){
                data.clientid=prompt("Enter the group name: ");
                data.command="create group";
                socket.write(JSON.stringify(data));
                
            }else if(answers["opening options"]=="view groups"){
                data.command="view groups";
                socket.write(JSON.stringify(data));
            }
        });

}

const chatQstn = [
    {
        type: "input",
        name: "message",

    }
]

async function mainfunc() {
    await inquirer.prompt([
        {
            type: 'list',
            name: 'opening options',
            choices: ['Register', 'login', 'exit'],
        },
    ])
        .then(answers => {
            if (answers['opening options'] == "Register") {
                fun();
            } else if (answers['opening options'] == "login") {
                fun2();
            } else if (answers['opening options'] == "exit") {
                process.exit();
            }
        });

}
socket.on("connect", () => {

    mainfunc();
    socket.on("data", (info) => {
        var data2 = JSON.parse(info);
        if (data2.success == false) {

            if (data.command == 1) {
                setTimeout(() => {
                    term.clear();
                    console.log('\x1b[33m%s\x1b[0m', data2.msg);
                    whenInvalidFuncRegister();
                }, 2000);
            } else if (data.command == 2) {
                setTimeout(() => {
                    term.clear();
                    console.log('\x1b[33m%s\x1b[0m', data2.msg);
                    whenInvalidFuncLogin();
                }, 2000);

            } else if (data.command == -1) {
                setTimeout(() => {
                    term.clear();
                    console.log('\x1b[33m%s\x1b[0m', data2.msg);
                    task();
                })

            } else if (data.command == 4) {

                setTimeout(() => {
                    term.clear();
                    console.log('\x1b[33m%s\x1b[0m', data2.msg);
                    task();
                })
            }else if(data2.command=="view groups"){
                setTimeout(() => {
                    term.clear();
                    console.log('\x1b[33m%s\x1b[0m', data2.msg);
                    task();
                }) 
            }
        } else if (data2.success) {
            if (data.command == 1) {
                setTimeout(() => {
                    term.clear();
                    console.log('\x1b[33m%s\x1b[0m', data2.msg);
                    afterRegisterFunc();
                }, 1000);
            } else if (data.command == 2) {
                setTimeout(() => {
                    term.clear();
                    console.log('\x1b[33m%s\x1b[0m', data2.msg);
                    task();
                }, 1000)

            } else if (data.command == 3) {
                console.log('\x1b[33m%s\x1b[0m', data2.msg);
                task();
            } else if (data.command == 0) {
                if (data2.msg2.length == 0) {
                    setTimeout(() => {
                        term.clear();
                        console.log('\x1b[33m%s\x1b[0m', "Sorry, no clients available");
                        task();
                    }, 1000);
                }
                else {
                    activeUsers = data2.msg2.split(", ");
                    activeUsers.pop(activeUsers[activeUsers.length - 1])
                    activeUsers.push("Go back");
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'opening options',
                            choices: activeUsers,
                        },
                    ])
                        .then(answers => {
                            if (answers['opening options'] == "Go back")
                                setTimeout(() => {
                                    term.clear();
                                    task();
                                })
                            else {
                                //console.log(answers)
                                data.clientid = answers['opening options'];
                                data.command = 4;
                                socket.write(JSON.stringify(data));
                            }

                        });

                }
            } else if (data.command == 4) {
                senderChat = data2.chatMode;
                console.log('\x1b[33m%s\x1b[0m', data2.msg);
                if (senderChat || receiverChat) {
                    //console.log("chat is true now");
                    data.command = "chatting"
                    socket.write(JSON.stringify(data));
                }

            } else if (data.command == -1) {
                var requests = data2.msg.split(",");
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'opening options',

                        choices: requests,
                    },
                ])
                    .then(answers => {
                        data.clientid = answers['opening options'];
                        data.command = -2;
                        socket.write(JSON.stringify(data));


                    });

            } else if (data.command == -2) {
                setTimeout(() => {
                    receiverChat = data2.chatMode;
                    console.log('\x1b[33m%s\x1b[0m', data2.msg);
                    data.command = "chatting"
                    socket.write(JSON.stringify(data));
                }, 1000)


            } else if (data.command == -3) {
                quit = data2.hadQuit;
                if (quit) {
                    data.command = "quitting";
                    socket.write(JSON.stringify(data));

                } else {
                    console.log("sender chat: "+senderChat);
                    console.log("Receiver chat: "+receiverChat);
                    console.log('\x1b[33m%s\x1b[0m', data2.msg);
                }
            } else if (data.command == -4) {
                console.log('\x1b[33m%s\x1b[0m', data2.msg);


            } else if (data.command == "chatting") {

                //console.log("quit is: "+quit);


                setTimeout(() => {
                    term.clear();
                    console.log(chalk.greenBright(data2.msg));
                    readLine.close();
                    process.stdin.resume();
                })

            } else if (data.command == "logout") {
                setTimeout(() => {
                    term.clear();
                    console.log('\x1b[33m%s\x1b[0m', data2.msg);
                    mainfunc();
                })
            } else if (data.command == "quit") {

                data.command = "quitting";
                socket.write(JSON.stringify(data));
                //console.log('\x1b[33m%s\x1b[0m', data2.msg);
                //task();

            } else if (data.command == "quitting") {
                setTimeout(() => {
                    term.clear();
                    console.log('\x1b[33m%s\x1b[0m', data2.msg);

                    data.command = "neutral";
                    socket.write(JSON.stringify(data));
                })
            } else if (data.command == "neutral") {
                task();
                 senderChat=false;
                receiverChat=false; 
                //quit=false;
            }else if(data.command=="create group"){
                /* setTimeout(() => {
                    term.clear();
                    
                    task();
                }) */
                console.log('\x1b[33m%s\x1b[0m', data2.msg);
                task();
            }else if(data.command=="view groups"){
                /* setTimeout(() => {
                    term.clear();
                    
                    task();
                }); */
                console.log('\x1b[33m%s\x1b[0m', data2.msg);
                task();
            }
        }





        //console.log(data.length)
    })
    socket.on('timeout', () => {
        socket.write('quit');
        socket.end();
    });

    socket.on('end', () => {
        process.exit();
    });

    socket.on('error', () => {
        console.log('The server seems to have been shut down...');
        socket.destroy();
    });
    stdin.addListener("data", function (d) {
        var message = d.toString().trim();
        if (senderChat || receiverChat) {
            if (message == "quit") {
                /* senderChat = false;
                receiverChat = false; */
                data.command = "quit";
                socket.write(JSON.stringify(data));
            } else {
                data.command = -3;
                data.msg = message;
                socket.write(JSON.stringify(data));
                //console.log(data.command)
            }
        }
    });
    readLine.on("line", (message) => {

    })
    /*readLine.on("line", (message) => {
        process.stdin.resume();
        //console.log("reading");
        if (senderChat || receiverChat) {
            if (message == "quit") {
                data.command = "quit";
                socket.write(JSON.stringify(data));
                
            } else {
                //console.log("reading");
                data.command = -3;
                data.msg = message;
                socket.write(JSON.stringify(data))
              
            }

        }


    })*/





})