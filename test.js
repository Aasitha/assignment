const net=require("net");
var term=require("terminal-kit").terminal;
var term2=require("terminal-kit").terminal;
const prompt=require("prompt-sync")({sigint:true});

const mongoose = require("mongoose");
var url = "mongodb://127.0.0.1:27017/assignment"


var publicKey="MIIBCgKCAQEAx9m/lkm5xZlBgqZwrxOGgU0+abcd6WF+LRnPs8vlalGZWXBgjxUNyIiNhcLe56Fi+5sT924k7zvN34dMe96HsUqgtkKIdqZXKYFpPWELBWXXScfYe4JaSJoxGSAwUN82XXLLOD/F6A9J5+AEOs1fbqfXYA/ZXXYd2Za/MxJLzxs3YTlKBlHDOkd+cBjXTGh87Rdm5v/HQx+0+L7pE47pwrqltP/tDDvS9jg5wELAWZgaHiImkR7zEEvaE14E9licnwR3wP8gNXU2CYVjuCheDAxOjcQLXzL/dZHjNIXk+g2Jw8YFSj/RUM2DhJ7w+aUmDwlgTh+2YGrKxJKz2GIOmwIDAQAB"
const crypto=require("crypto");
var data={ 
}
//var id=0;
var items2=[
"1. View Active Clients",
"2. Join 1:1 session",
"3. Join group chat",
"4. Create a group",
"5. View Requests"
]
var items=[
    "1. Register",
    "2. Login"
    
]
//const userArr=[];
//var ditems2=["1","2","3","4","5","6"];

const readLine = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("press 0 for input line shortcuts");

const socket=net.connect({
    port: 1235
})


socket.on("connect",()=>{

   
        
        term.singleColumnMenu(items , function( error , response ){
            //term( '\n' ).eraseLineAfter.green() ;
            //socket.write(JSON.stringify(data));
            data.command=response.selectedIndex+1;
            if(data.command==1){
                var username=prompt("Enter username: ");
                var password=prompt("Enter password: ");
                
                
                mongoose.set("strictQuery",false);
                mongoose.connect("mongodb://127.0.0.1:27017/assignment",{
                    useNewUrlParser:true,
                    useUnifiedTopology:true
                },(err)=>{
                    if(err){
                    console.log("error "+err);
                    res.send(err.toString());
                }else{
                    //console.log("successfully connected");
        //res.send("successfully connected");
                }
                var userSchema = new mongoose.Schema({
                    username: String,
                    password:String
                });
         
                var userModel=mongoose.model('users',userSchema);
                const datt=new userModel({
                    username:username,
                    password:password
                })
                userModel.find({username:datt.username},function(err,docs){
                    if(err) throw err
                    else{
                        if(Object.keys(docs).length>0){
                            console.log(`Error:This username already exixts`)
                            socket.destroy();;
                        }else {
                            datt.save(function(err,doc){
                                if(err) throw err;
                                else console.log("Reistration completed")
                            })
                        }
                    }
                })
                //socket.destroy();
                
});

            }else if(data.command==2){
                
                var username=prompt("Enter username: ");
                var password=prompt("Enter password: ");
                data.uname=username;
                data.pass=password;
                mongoose.set("strictQuery",false);
                mongoose.connect("mongodb://127.0.0.1:27017/assignment",{
                    useNewUrlParser:true,
                    useUnifiedTopology:true
                },(err)=>{
                    if(err){
                    console.log("error "+err);
                    //res.send(err.toString());
                }else{
                    console.log("successfully connected");
                    //res.send("successfully connected");
                }
                var userSchema = new mongoose.Schema({
                    username: String,
                    password:String
                });
         
                var userModel=mongoose.model('users',userSchema);
                userModel.find({username:username ,password:password},function(err,docs){
                    if(err) throw err;
                    console.clear();
                    if(Object.keys(docs).length==0){
                        console.log("Invalid login.Please try again\n");
                        socket.destroy();
                    }else{
                    socket.write(JSON.stringify(data));
                    term.singleColumnMenu(items2,function(err,res){
                        term.white("\n");
                        
                        data.command=res.selectedIndex+3;
                        if(data.command==3){
                            data.msg=""
                            data.clientid=""
                            socket.write(JSON.stringify(data));
                            
                        }
                        

                        else if(data.command==4){
                            readLine.question("Enter the destination client: ",(ans)=>{
                                data.clientid=ans;
                                data.msg="";
                                
                            })

                        }else if(data.command==5){
                            data.msg="";
                        readLine.question("Enter name of the group you want to join",answer=>{
                        data.clientid=answer;
                        socket.write(JSON.stringify(data));
                })
                        }
                        else if(data.command==6){
                            data.msg="";
                            readLine.question("Enter name of your group",answer=>{
                            data.clientid=answer;
                            socket.write(JSON.stringify(data));
                })
                        }else if(data.command==7){
                            socket.write(JSON.stringify(data));
                        }
                    })
                    
                }
                    

                })
});
                
                
            }
            
            socket.on("data",(data)=>{
                //console.log('\x1b[33m%s\x1b[0m', data);
                
                    
                    /*if(data.toString().substring(0,8)=="Requests"){
                        var dat=data.toString();

                        dat=dat.substring(8);
                        dat=dat.split(",");
                        
                    }else{*/
                        console.log('\x1b[33m%s\x1b[0m',data.toString());
                    
                    
                    
                    
                
                
                
                //console.log(data.length)
            })
            readLine.on("line",(message)=>{
                //console.log(data.uname+": ");
                data.msg=message;
                if(message=="requests"){
                    data.command=7;
                    //socket.write(JSON.stringify(data));
                }else if(message.substring(0,6)=="accept"){
                    data.msg="accept";
                    data.clientid=message.substring(6);
                    data.command=4;
                    //socket.write(JSON.stringify(data).substring(81));
                    
                }
                if(message=="0"){
                    data.command="";
                    socket.write(JSON.stringify(data));
                    /*
                    term.cyan("show active clients");
                    console.log("start 1:1 session\n");
                    console.log("start group session\n");
                    console.log("view active groups\n");
                    console.log("create group\n");
                    console.log("requests");*/
                    term.table( [
                        [ 'input value' , 'Description'] ,
                        ['show active clients', 'Displays active clients' ] ,
                        ['start 1:1 session' , 'allows you to start a 1:1 session' ] ,
                        ['start group session' , 'allows you to start a group session' ] ,
                        ['view active groups' , 'Displays active groups' ],
                        ['create group' , 'creates a group with you as admin' ] ,
                        ['show requests' , 'Displays requests you got' ] ,
                    ] , {
                        hasBorder: true ,
                        contentHasMarkup: true ,
                        borderChars: 'lightRounded' ,
                        borderAttr: { color: 'blue' } ,
                        textAttr: { bgColor: 'default' } ,
                        firstCellTextAttr: { bgColor: 'blue' } ,
                        firstRowTextAttr: { bgColor: 'yellow' } ,
                        width: 60 ,
                        fit: true   // Activate all expand/shrink + wordWrap
                    }
                ) ;



                }else if(message=="show active clients"){
                    data.command=3;
                }
                socket.write(JSON.stringify(data))
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
    
       //process.exit() ;
      
       
})
   






