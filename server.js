const net=require('net');
const { type } = require('os');
var term=require("terminal-kit").terminal;

const readLine = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

/*mongoose.connect("mongodb://localhost:27017/assignment", {
   useNewUrlParser: true,
   useUnifiedTopology: true
});*/
var activeClients=[]
let sockets={};
var groups={}
let clientid=0;
const crypto = require("crypto");
const { exit } = require('process');

// The `generateKeyPairSync` method accepts two arguments:
// 1. The type ok keys we want, which in this case is "rsa"
// 2. An object with the properties of the key
//var publicKey="MIIEowIBAAKCAQEAx9m/lkm5xZlBgqZwrxOGgU0+abcd6WF+LRnPs8vlalGZWXBgjxUNyIiNhcLe56Fi+5sT924k7zvN34dMe96HsUqgtkKIdqZXKYFpPWELBWXXScfYe4JaSJoxGSAwUN82XXLLOD/F6A9J5+AEOs1fbqfXYA/ZXXYd2Za/MxJLzxs3YTlKBlHDOkd+cBjXTGh87Rdm5v/HQx+0+L7pE47pwrqltP/tDDvS9jg5wELAWZgaHiImkR7zEEvaE14E9licnwR3wP8gNXU2CYVjuCheDAxOjcQLXzL/dZHjNIXk+g2Jw8YFSj/RUM2DhJ7w+aUmDwlgTh+2YGrKxJKz2GIOmwIDAQABAoIBADu2xlYjhUyTdE2TacwGK4RrDiEMQ/W92bOkKLlyTQQtiYJ933whMFMg6hhzl6LiR+8h8R9XW9XXqrYFeUbxwN2qjMaorpm1LgoKzuU2H9LnESLMgdS1qEBVQiJdydIAQABAEpSmCX5DQzPzbZAcWU14/ROI6MvSRS0Eq/CYoOoqkgWWr6X+THN1pAb+gtpcKUQI/p6xnZA2/ODkXmUlemRM8sRKX0nsrIF0WGTEYDEsvdHn8p/A5XdlxPOe6wKgCZa7nsewIuOE2mVXNJlhZYXGPp1nGx3poL0qpkWDR7VVJA10JwwY9y7MSa3AWtkxpXXd4rZZ8u4/teBbbVBAVhECgYEA9gnI4/Ainq8rtbi+EbkOowMN76IqTB4HYGzfNRIzdRcPomFrDfpPytzs2IRKRn7PFxgDNw+Op5dyAVhOW7mG36323WSkkWMdzemj1LbJBulsq1+zQBE37Fby/TnDXZnwER/RvNOSrfyHO9MuVtUmg6uyd3EePdQ1KJZDt33wq0UCgYEAz/E5KUmJV5xPy8sP3ToMLMvBh0ZLh2jpaMJYxUSvoJLJA+KxPutHLC3jAVCC/MadNBekWqHO+mNXqKfETHnU2MBaRVC7lHKYshBvCbP6nMYsOMtrLPl3NaYRPoJjLs8zSRJ/sH9Aj6g2KufFkf2ickjwq10dYOig/T+FotuwgF8CgYA2g7qATr/M+zErJZDvqlpE4jNfSkYm8WxfACCAyNSf+AkdyIoI4dJ2N3c/DijK7+QA0PA9bfQEzDiVdbR+/F+XBhuxuFACary62C7Vvd5S6ruKST0VT/tdIXLbisXv4mDf2nYFabeRV2e7aLJWyQmsmQmFD4pM1s0kfg7pBD2kJQKBgQCT0nr9M86T3oYHbPJ5JTPUgICyZrF4sIcFNuueSObFMrP9tCCmhuFQsconfBGyGotUpd3rpA2ciBSfy6vLZex+rbc+gVbn/9M2+mHFNxHYczSqp0kobqtlEwo9MrnJY/ikYKcvVDcUKNNhCuSzlOfvcJTObWJeKuGPRqH8lUpS5wKBgDTq1E5JQyX53TWxzGwV2HhbJPavds6MJ8C0OAbbOxCAs5PYXjkuJHjjFS4ZlInHNepOgSxkdb8khxZdp3tCMgeVCoa3kzjlvOCELYA4vcz/ChdDpUdEqwoor5igg+6nYnLOiq7du7MHdN9yEM1Xb6gubV5OAIPnO1u3kENZNI2N"

/*console.log(
	publicKey.export({
		type: "pkcs1",
		format: "pem",
	}),

	privateKey.export({
		type: "pkcs1",
		format: "pem",
	})
)*/
//console.log(sockets);

const server=net.createServer();

server.on("connection",socket=>{   
    clientid+=1
    socket.id=clientid;
    
    
    
    
    
    
    socket.on("data",(info)=>{
        
        
        
        var data=JSON.parse(info);

        
            
            
        
            if(data.command==2){
                
                socket.username=data.uname;
                socket.isInChat=false;
                socket.isInGroup=false;
                socket.requests=[];
                socket.patner="";
                sockets[socket.username]=socket;
                socket.write(`successfully logged in as ${socket.username}\n`);
                console.log("client connected with socket id: ",socket.id+" and with ip as: "+socket.remoteAddress+":"+socket.remotePort);
                console.log(`Number of active clients are: ${Object.keys(sockets).length}`);
                
            }
            else if(data.command==3){
            
            
            
            
            var cli="";
            Object.keys(sockets).forEach(i=>{
                cli+=i.toString();
                cli+=", ";
            })
            socket.write("The active clients are "+cli);
            //console.log(typeof(name))
            delete sockets[socket.username]


            socket.destroy();
            console.log(Object.keys(sockets))
            console.log(`the number of active clients are ${Object.keys(sockets).length}`)
        }else if(data.command==4){
            if(Object.keys(sockets).indexOf(data.clientid)==-1){
                socket.write(`There is no such client as ${data.clientid}`);
                socket.destroy();
            }else{
            if(data.msg==""){
                if(sockets[data.clientid].isInChat==false){

                    sockets[data.clientid].requests.push(socket.username);
                    socket.write(`Request is sent to ${data.clientid}`)
                    sockets[data.clientid].write(`You have a request from ${socket.username}\nEnter acept<username> to open session`)

                }else{
                    socket.write(`${data.clientid} is not available for chat`);
                    socket.destroy();
                }
            }else{
                
                if(data.msg=="accept"){
                    socket.write(`You have accepted the request from ${data.clientid}`);
                    socket.patner=data.clientid;
                    sockets[data.clientid].patner=socket.username;
                    socket.isInChat=true;
                    sockets[data.clientid].isInChat=true;
                    sockets[socket.patner].write("Your requestis being accepted");
                }
                else if(sockets[socket.username].patner!=data.clientid){
                    socket.write("Your request is not accepted yet");
                }
                else if(data.msg=="quit"){
                   
                    sockets[socket.username].write(`You have terminated the session with ${socket.patner}\n`);
                    if(sockets[data.clientid]){
                        sockets[socket.patner].write(`Your session with ${socket.username} has been terminated`)
                    }
                    socket.isInChat=false;
                    sockets[socket.patner].isInChat=false;
                    sockets[socket.patner].patner=""
                    socket.patner="";
                    data.command="";

                    exit;


                    
                    //delete sockets[socket.username]
                    //socket.destroy()

                    /*if(sockets[data.clientid]) {
                        sockets[data.clientid].destroy();
                        delete sockets[data.clientid]
                    }*/
                }
                else sockets[socket.patner].write(data.uname+": "+data.msg);
            }
        }
        }else if(data.command==5){
            socket.username=data.uname;
            sockets[socket.username]=socket;
            if(data.msg==""){
                groups[data.clientid].participants.push(socket.username);
                console.log("Active clients are: "+groups[data.clientid].participants);
                socket.write("You have joined the group "+data.clientid);
                groups[data.clientid].participants.forEach(socket1=>{
                    if(socket1!=socket.username){
                        sockets[socket1].write(`${data.uname} has joined the group chat`);
                    }
                })

            }else{
                if(sockets[socket.username].part)
                var message="";
                if(data.msg=="quit"){
                    message+=`${data.uname} has left the chat`;
                    groups[data.clientid].participants.pop(socket.username);
                    socket.write("You have left the group chat");
                    socket.destroy();
                    delete sockets[socket.username];
                    console.log(`Active participants are: ${groups[data.clientid].participants}`)
                    groups[data.clientid].participants.forEach(socket1=>{
                        if(socket1!=socket.username){
                            sockets[socket1].write(message);
                        }
                        
                    })
                
                    socket.write("you have left the chat");
                    socket.destroy();
                    delete sockets[socket.username]
                        
                    
                }else if(data.msg=="close"){
                    if(groups[data.clientid].admin==socket.username){
                        groups[data.clientid].participants.forEach(person=>{
                            if(person!=socket.username){
                                sockets[person].write(`Admin ${socket.username} has closed the group\nConnect again`);
                                sockets[person].destroy();
                                delete sockets[person];

                            }
                        })
                        delete groups[data.clientid];
                        socket.write("You have closed the group\nConnect again")
                        socket.destroy();
                        delete sockets[socket.username];
                        console.log(`Active groups are ${Object.keys(groups)}`);
                        console.log(`Active clients are ${Object.keys(sockets)}`);
                    }else{
                        socket.write("Only admin  has permission to close the group");
                    }
                }
                else{
                    message+=data.uname+": "+data.msg;
                    groups[data.clientid].participants.forEach(socket1=>{
                        if(socket1!=socket.username){
                            sockets[socket1].write(message);
                            
                        }
                    })
                }
                
            }
        }else if(data.command==6){
            if(data.msg==""){
            var grpinfo={
                name:data.clientid,
                admin:socket.username,
                participants:[]
            }
            groups[data.clientid]=grpinfo;
            groups[data.clientid].participants.push(socket.username);
            socket.write(`Group ${data.clientid} is created`);
            console.log(`Group ${data.clientid} is created by ${socket.username}`);
            console.log("Active participants: "+groups[data.clientid].participants);
            }else{
                if(data.msg=="close"){
                    if(socket.username==groups[data.clientid].admin){
                        groups[data.clientid].participants.forEach(person=>{
                            if(person!=socket.username){
                                sockets[person].write("Group is closed by admin\nconnect again");
                                sockets[person].destroy();
                                delete sockets[person];
                                delete groups[data.clientid];

                            }
                            socket.write("You have closed the group\nConnect again");
                            socket.destroy();
                            delete sockets[socket.username];
                            console.log(`Active groups are: ${Object.keys(groups)}`);
                            console.log(`Active participants are: ${Object.keys(sockets)}`);
                        })
                    }else{
                        socket.write("Only admin has permission to close the group");
                    }
                }else if(data.msg=="quit"){
                    //groups[data.clientid].participants.pop(socket.username);
                    groups[data.clientid].participants.splice(0,1)
                    console.log(`Active participants in the group are: ${groups[data.clientid].participants}`);
                    console.log(`New admin for ${data.clientid} is ${groups[data.clientid].participants[0]}`);
                    if(groups[data.clientid].admin==socket.username)
                        groups[data.clientid].admin=groups[data.clientid].participants[0];
                    groups[data.clientid].participants.forEach(person=>{
                        if(person!=socket.username){
                            sockets[person].write(socket.username+" has left from the chat\n");
                            //if(groups[data.clientid].admin==socket.username){ 
                                sockets[person].write(`${groups[data.clientid].admin} is now admin`);
                            
                        }
                    })
                    socket.write("You left the group\nConnect again");
                    socket.destroy();
                    
                    delete sockets[socket.username];
                    console.log(`Active groups are: ${Object.keys(groups)}`);
                    console.log(`Active Participants are: ${Object.keys(sockets)}`);

                }else{
                    groups[data.clientid].participants.forEach(person=>{
                    if(person!=socket.username){
                        sockets[person].write(socket.username+": "+data.msg);
                    }
                })
            }
            }

        }else if(data.command==7){
            //socket.username=data.uname;
            
            
            var req=""
            if(sockets[socket.username].requests.length>0){
            sockets[socket.username].requests.forEach(person=>{
                req+=person+",";
            })
            socket.write(`Requests are from: ${req}`);
            }else{
                socket.write("you have no requests");
            }
            
        }else if(data.command==8){
            socket.patner=data.clientid;
            sockets[data.clientid].patner=socket.username;
            socket.isInChat=true;
            sockets[data.clientid].isInChat=true;
            socket.write(`You have accepted the request from ${data.clientid}`);
            sockets[data.clientid].write(`Your request to ${socket.username} is accepted.\n`)

        }
    })
    socket.on("error",()=>{
        console.log(`${socket.username} is disconnected`);
        delete sockets[socket.username]
        socket.destroy();
        console.log(`the number of active clients are ${Object.keys(sockets).length}`)
    })

    
})
server.listen(1235);