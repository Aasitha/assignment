const net = require('net');
var term = require("terminal-kit").terminal;
var term2 = require("terminal-kit").terminal;
const prompt = require("prompt-sync")({ sigint: true });
var inquirer = require("inquirer");
var chalk = require("chalk");
var activeUsers = [];
const readLine = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const socket = net.connect({
    port: 1235
})
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
async function requestToClients2(activeUsers) {

}
async function cl() {
    await setTimeout(() => {
        term.clear();
    }, 2000);
}
const sample = [{
    type: "input",
    name: "action",
    message: "enter name:"

}, {
    type: "password",
    mask: "*",
    name: "password",
    message: "enter password"
}]
var data = {

}
var tasks = [
    "view active clients",
    "start 1:1 session",
    "view requests"
]

async function task() {
    await inquirer.prompt([
        {
            type: 'list',
            name: 'opening options',
            //message: 'Which is better?',
            choices: tasks
        },
    ])
        .then(answers => {
            //console.log(answers)
            if (answers['opening options'] == "view active clients") {
                viewActiveClients();



            } else if (answers["opening options"] == "start 1:1 session") {
                requestToClients();
            }
            else if (answers["opening options"] == "view requests") {
                acceptRequests();
            }
        });
}
async function fun() {
    await inquirer.prompt(loginQstns).then((answers) => {
        data.uname = answers.username;
        data.pass = answers.password
        data.command = 1;

    })
    socket.write(JSON.stringify(data));
    //console.log("demo");



}
async function fun2() {
    await inquirer.prompt(loginQstns).then((answers) => {
        data.uname = answers.username;
        data.pass = answers.password
        data.command = 2;

    })
    socket.write(JSON.stringify(data));
    //console.log("demo");



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

socket.on("connect", () => {

    async function mainfunc() {
        await inquirer.prompt([
            {
                type: 'list',
                name: 'opening options',
                //message: 'Which is better?',
                choices: ['Register', 'login'],
            },
        ])
            .then(answers => {
                //console.log(answers)
                if (answers['opening options'] == "Register") {


                    fun();
                } else if (answers['opening options'] == "login") {
                    fun2();
                }
            });
    }
    mainfunc();
    socket.on("data", (info) => {
        //console.log('\x1b[33m%s\x1b[0m', data);


        /*if(data.toString().substring(0,8)=="Requests"){
            var dat=data.toString();

            dat=dat.substring(8);
            dat=dat.split(",");
            
        }else{*/
        //console.log('\x1b[33m%s\x1b[0m', data.toString());
        var data2 = JSON.parse(info);


        if (data2.success == false) {
            console.log('\x1b[33m%s\x1b[0m', data2.msg);
            if (data.command == 1) {
                fun();
            } else if (data.command == 2) {
                fun2();
            } else if (data.command == -1) {
                task();
            }


            /*var options = ['retry', 'exit'];
            term.singleColumnMenu(options, function (err, res) {
                if (err) console.log(err)
                else {
                    if (res.selectedIndex == 0) {
                        if (data.command == 1) {
                            setTimeout(()=>{
                                term.clear();
                                fun();
                            },2000);
                            
                            readLine.write(null,{
                                ctrl:true,
                                name:"u"
                            })

                        }else if(data.command==2){
                            
                            fun2();
                            readLine.write(null,{
                                ctrl:true,
                                name:"u"
                            })
                        }
                    } else {
                        process.exit();
                    }
                }
            })*/
        } else if (data2.success) {
            if (data.command == 1) {

                console.log('\x1b[33m%s\x1b[0m', data2.msg);
            } else if (data.command == 2) {
                console.log('\x1b[33m%s\x1b[0m', data2.msg);

                task();
            } else if (data.command == 3) {
                console.log('\x1b[33m%s\x1b[0m', data2.msg);
                task();
            } else if (data.command == 0) {
                activeUsers = data2.msg2.split(", ");
                //requestToClients2(activeUsers);

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'opening options',
                        //message: 'Which is better?',
                        choices: activeUsers,
                    },
                ])
                    .then(answers => {
                        //console.log(answers)
                        data.clientid = answers['opening options'];
                        data.command = 4;
                        socket.write(JSON.stringify(data));
                    });
            } else if (data.command == 4) {
                console.log('\x1b[33m%s\x1b[0m', data2.msg);
            } else if (data.command2 == -1) {
                var requests = data2.msg.split(",");
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'opening options',
                        //message: 'Which is better?',
                        choices: requests,
                    },
                ])
                    .then(answers => {
                        data.clientid=answers['opening options'];
                        data.command=-2;
                        socket.write(JSON.stringify(data));

                    });
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



})