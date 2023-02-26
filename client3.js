const net = require('net');
var term = require("terminal-kit").terminal;
var term2 = require("terminal-kit").terminal;
const prompt = require("prompt-sync")({ sigint: true });
var inquirer = require("inquirer");
var chalk = require("chalk");
var activeUsers = [];
var senderChat=false;
var receiverChat=false;
const readLine2 = require('readline').createInterface({
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

    var prompt= await inquirer.prompt(loginQstns).then((answers) => {
        data.uname = answers.username;
        data.pass = answers.password
        data.command = 1;
        
        

    })
    socket.write(JSON.stringify(data));


}
async function fun2() {

    var prompt=await inquirer.prompt(loginQstns).then((answers) => {
        data.uname = answers.username;
        data.pass = answers.password
        data.command = 2;
        

    })
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
    var prompt=await inquirer.prompt([
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
    prompt.close();
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

            }else if(answers["opening options"]=="Logout"){
                data.command="logout";
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
async function takeInput() {

    /* await inquirer.prompt(chatQstn).then((answers) => {

        data.command = -3;
        data.msg = answers.message;
        socket.write(JSON.stringify(data));

    }) */
    var msg=prompt();
    if(msg!="quit"){
        data.command=-3;
        data.msg=msg;
        socket.write(JSON.stringify(data));
        takeInput();
    }
}
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
                if(data2.msg2.length==0){
                    setTimeout(() => {
                        term.clear();
                        console.log('\x1b[33m%s\x1b[0m', "Sorry, no clients available");
                        task();
                    }, 1000);
                }
                else{
                activeUsers = data2.msg2.split(", ");
                activeUsers.pop(activeUsers[activeUsers.length-1])
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
                            setTimeout(()=>{
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
                if (senderChat) {
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
                    receiverChat=data2.chatMode;
                    console.log('\x1b[33m%s\x1b[0m', data2.msg);
                    data.command = "chatting"
                    socket.write(JSON.stringify(data));
                })


            } else if (data.command == -3) {
                console.log('\x1b[33m%s\x1b[0m', data2.msg);

            } else if (data.command == -4) {
                console.log('\x1b[33m%s\x1b[0m', data2.msg);


            } else if (data.command == "chatting") {
                
                setTimeout(()=>{
                    term.clear();
                    console.log(chalk.greenBright(data2.msg));
                    takeInput();
                    
                    

                    
                    
                })
            

                
                
            }else if(data.command=="logout"){
                setTimeout(()=>{
                    term.clear();
                    console.log('\x1b[33m%s\x1b[0m', data2.msg);
                    mainfunc();
                })
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
    readLine2.on("line",(message)=>{
        console.log(message)
        
    })
   



})