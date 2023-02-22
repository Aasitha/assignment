let inquirer =require('inquirer')

let question =[{
    type:"input",
    name:"action",
    message:"enter name:"

},{
    type:"password",
    mask:"*",
    name:"password",
    message:"enter password"
}]
inquirer.prompt(question).then((answers)=>{
    console.log(answers)
})