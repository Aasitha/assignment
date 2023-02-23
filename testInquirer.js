var inquirer=require('inquirer');
var chalk=require('chalk');


async function fun() {
    await inquirer.prompt(loginQstns).then((answers) => {
        console.log("printed")
    })
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
fun();