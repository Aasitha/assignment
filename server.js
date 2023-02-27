const net = require('net');
const { type } = require('os');
const mongoose = require("mongoose");
var term = require("terminal-kit").terminal;
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAztSZNHNFSHpbG5UFtcK94d66yL1tKG4upzDVJDbJhEENm26f
k5jAslYfw2JUtNCZTUXkGRrS0uCe3llZVyYpfyWPxuRt4aOO3wjTlIY9nd3LvOiy
5dySFrrIc9D5JdzrcTWJHJiF1QM/xELhnGe1ykz2+iJcyk/O9K+k63vklEstA8eH
MiHu2l6LSvlGhgPqoPvAylh/gC8zmg7r1NRNApMpVq15jPjzra+4p28afngYqERN
+mb67v+RQGWQ8K8sQWJE8rUfsXZWa4VkvSW3GQeT6IN/B7LxtmGevsBf0rhqSxof
hlObFtAkEYleDOvPyQLD+Z9oQSiiA1VstNBJ3wIDAQABAoIBAAJrrItXmgT6IZzW
BqYU7GH7WFZHGULy3yrnwGbXGU6p8D3UcpuomwC7T03bFcCz/EdSPRQqIzOCm3lg
tFH3yV6Kkv8x5zNP1bk4gjlnxMrXMK46TvWvuin376ajWHcf+cVuafditZZDnnhu
i/Nnp1IBypYs1scrXfGxKI30+jzeCvPSHql03EzPfogO19EvVA+52x3mWXpXxt4p
B8mZyvQbA8Cm/ZhLQRTAZ0Ff6E0DrTZ4kMhTtA8SqHZ1+7OxDrYzW0C73aFtG3g5
DlQEg1WhVd6tMVvTBJCQOZF6QcnBMps8K9aApdJs3BiBs7MOdQTxFqdTP9uH6kt7
XGMlhLECgYEA/swC1nVTi35CcblSD9KEJWfvd+De+BxRIzc3LGRO06gxpLQ+LbRu
uM+GW2u3E1mQNJUZ2KFY9hqkh790cDg3CcpRV1h3MeGu8zBQFxDSc2gRl9z9UBqx
viX9KEZjmhXUMoU9Yy1WibEBpxvSqpsNpEaM+340TpQg/7iqoSNXz/kCgYEAz86b
ec6nwJdBXiQNY2qwaxZdG+9Tr+DyBQ8Z2e4ogGVn6DVg3JstUTp0IDpUVvDYdjdJ
agkfPvrVWebtEXnNHF8DF6CLPdGJAf6e7IWpQk7xeooAVKLIVL8wr09eBNDsG5eK
8DDGOMIIY84QFPxUTGtk5WHAJm6w6ZXhPjcNDpcCgYAVs66yMYASK4jhQtWYf2e9
/+JHpaGYJGFMzJEoeMq2AGdqDegV4H5lw1dARiZrwX8k22Y+K0/2dkJ5RXdXb5JQ
hSj0dZaBayWJlR3dOROTvNNyyeHRhtSIy5eKbKRjJWTTgMG/xsbOJ4NqhlYlLdu1
mES9zvwJjVhaL5Jo8yexkQKBgEcRZJCiwTIXSG62q7F9Ujo9Wrhr/9Xde0eJo5Cp
Z0aJ56A9aRPpKfVmpUJEUIWvNogvXjcaSYpTZFWrqRXZ7vCt+bPB3vzURSPefWFs
ULdxohoDShun1BVPkYnS/ddtz+Gb0RNVyuSsTww687sJlJbR/56G8Jz0LCKmdHK/
hwKfAoGBAPj/E3ZAJFOcapyIxJ0SZjjS+LjFFvR0Y2ljiTjEV9zttPLpxiRtYKLE
iOtR075eZqgTeJdw/+D56nBcAWKwRGjh/aLVFqGniZpgv3sJLSgcMpsAv+7H5iD5
xHySp77NLGkmDIR0vrQVDHO7/izso4iC/0wKWEWgWzW9FHNuAD9a
-----END RSA PRIVATE KEY-----`
var data2 = {

}
const readLine = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});


/*mongoose.connect("mongodb://localhost:27017/assignment", {
   useNewUrlParser: true,
   useUnifiedTopology: true
});*/
var activeClients = []
let sockets = {};
var groups = {}
let clientid = 0;
const crypto = require("crypto");
const { exit } = require('process');
const { stringify } = require('querystring');
var publicKey = "MIIEowIBAAKCAQEAx9m/lkm5xZlBgqZwrxOGgU0+abcd6WF+LRnPs8vlalGZWXBgjxUNyIiNhcLe56Fi+5sT924k7zvN34dMe96HsUqgtkKIdqZXKYFpPWELBWXXScfYe4JaSJoxGSAwUN82XXLLOD/F6A9J5+AEOs1fbqfXYA/ZXXYd2Za/MxJLzxs3YTlKBlHDOkd+cBjXTGh87Rdm5v/HQx+0+L7pE47pwrqltP/tDDvS9jg5wELAWZgaHiImkR7zEEvaE14E9licnwR3wP8gNXU2CYVjuCheDAxOjcQLXzL/dZHjNIXk+g2Jw8YFSj/RUM2DhJ7w+aUmDwlgTh+2YGrKxJKz2GIOmwIDAQABAoIBADu2xlYjhUyTdE2TacwGK4RrDiEMQ/W92bOkKLlyTQQtiYJ933whMFMg6hhzl6LiR+8h8R9XW9XXqrYFeUbxwN2qjMaorpm1LgoKzuU2H9LnESLMgdS1qEBVQiJdydIAQABAEpSmCX5DQzPzbZAcWU14/ROI6MvSRS0Eq/CYoOoqkgWWr6X+THN1pAb+gtpcKUQI/p6xnZA2/ODkXmUlemRM8sRKX0nsrIF0WGTEYDEsvdHn8p/A5XdlxPOe6wKgCZa7nsewIuOE2mVXNJlhZYXGPp1nGx3poL0qpkWDR7VVJA10JwwY9y7MSa3AWtkxpXXd4rZZ8u4/teBbbVBAVhECgYEA9gnI4/Ainq8rtbi+EbkOowMN76IqTB4HYGzfNRIzdRcPomFrDfpPytzs2IRKRn7PFxgDNw+Op5dyAVhOW7mG36323WSkkWMdzemj1LbJBulsq1+zQBE37Fby/TnDXZnwER/RvNOSrfyHO9MuVtUmg6uyd3EePdQ1KJZDt33wq0UCgYEAz/E5KUmJV5xPy8sP3ToMLMvBh0ZLh2jpaMJYxUSvoJLJA+KxPutHLC3jAVCC/MadNBekWqHO+mNXqKfETHnU2MBaRVC7lHKYshBvCbP6nMYsOMtrLPl3NaYRPoJjLs8zSRJ/sH9Aj6g2KufFkf2ickjwq10dYOig/T+FotuwgF8CgYA2g7qATr/M+zErJZDvqlpE4jNfSkYm8WxfACCAyNSf+AkdyIoI4dJ2N3c/DijK7+QA0PA9bfQEzDiVdbR+/F+XBhuxuFACary62C7Vvd5S6ruKST0VT/tdIXLbisXv4mDf2nYFabeRV2e7aLJWyQmsmQmFD4pM1s0kfg7pBD2kJQKBgQCT0nr9M86T3oYHbPJ5JTPUgICyZrF4sIcFNuueSObFMrP9tCCmhuFQsconfBGyGotUpd3rpA2ciBSfy6vLZex+rbc+gVbn/9M2+mHFNxHYczSqp0kobqtlEwo9MrnJY/ikYKcvVDcUKNNhCuSzlOfvcJTObWJeKuGPRqH8lUpS5wKBgDTq1E5JQyX53TWxzGwV2HhbJPavds6MJ8C0OAbbOxCAs5PYXjkuJHjjFS4ZlInHNepOgSxkdb8khxZdp3tCMgeVCoa3kzjlvOCELYA4vcz/ChdDpUdEqwoor5igg+6nYnLOiq7du7MHdN9yEM1Xb6gubV5OAIPnO1u3kENZNI2N"


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

const server = net.createServer();

server.on("connection", socket => {
    clientid += 1
    socket.id = clientid;






    socket.on("data", (info) => {



        var data = JSON.parse(info);



        if (data.command == 1) {
            username = data.uname;
            password = data.pass;
            var decrypt = crypto.privateDecrypt(privateKey, Buffer.from(password.toString("base64"), "base64"));
            password = decrypt.toString();
            mongoose.set("strictQuery", false);
            mongoose.connect("mongodb://127.0.0.1:27017/assignment", {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }, (err) => {
                if (err) {
                    console.log("error " + err);
                    res.send(err.toString());
                } else {
                    //console.log("successfully connected");
                    //res.send("successfully connected");
                }


                var userModel = mongoose.model('users', userSchema);
                const user = new userModel({
                    username: username,
                    password: password
                })
                userModel.find({ username: username }, function (err, docs) {
                    if (err) throw err
                    else {
                        if (Object.keys(docs).length > 0) {
                            data2.success = false;
                            data2.msg = "username already exists.Retry";
                            socket.write(JSON.stringify(data2));
                        } else {
                            user.save(function (err, doc) {
                                if (err) throw err;
                                else {
                                    data2.success = true;
                                    data2.msg = "user registered";
                                    socket.write(JSON.stringify(data2));

                                }
                            })
                        }
                    }
                })
                //socket.destroy();

            });
        }

        else if (data.command == 2) {
            //console.log("Before Decryption: "+data.pass);
            mongoose.set("strictQuery", false);
            mongoose.connect("mongodb://127.0.0.1:27017/assignment", {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }, (err) => {
                if (err) {
                    console.log("error: " + err);
                } else {

                }

                var userModel = mongoose.model('users', userSchema);
                var decrypt = crypto.privateDecrypt(privateKey, Buffer.from(data.pass.toString("base64"), "base64"));
                data.pass = decrypt.toString();
                //console.log("After Decryption: "+data.pass);
                userModel.find({ username: data.uname, password: data.pass }, function (err, docs) {
                    if (err) {
                        console.log("Error: " + err);
                    } else {
                        if (Object.keys(docs).length == 0) {
                            data2.success = false;
                            data2.msg = "Invalid login. Please try again";
                        } else {
                            if(Object.keys(sockets).indexOf(socket.username)!=-1){
                                data.success=fail;
                                data2.msg=`Already logged in`;
                            }else{
                            data2.success = true;
                            socket.username = data.uname;
                            socket.isInChat = false;
                            socket.isInGroup = false;
                            socket.requests = [];
                            socket.sentRequest = [];
                            socket.patner = "";
                            socket.grpPatner = "";
                            sockets[socket.username] = socket;
                            
                            data2.msg = "Logged in";
                            console.log(`Number of active clients are: ${Object.keys(sockets).length}`);
                            }
                        }
                        socket.write(JSON.stringify(data2));
                    }
                })
            })

            //socket.write(`successfully logged in as ${socket.username}\n`);
            // console.log("client connected with socket id: ", socket.id + " and with ip as: " + socket.remoteAddress + ":" + socket.remotePort);


        }
        else if (data.command == 3 || data.command == 0) {
            data2.hadQuit = false;




            var cli = "";
            Object.keys(sockets).forEach(i => {
                if (i != socket.username && sockets[i].isInChat == false && sockets[i].isInGroup == false) {
                    cli += i + ", ";
                }
            })
            if (cli.length > 0) {
                data2.success = true;
                data2.msg = "Active clients: " + cli;
                data2.msg2 = cli;
            } else {
                data2.success = true;
                data2.msg2 = ""
                data2.msg = "There are no active clients";
            }
            socket.write(JSON.stringify(data2));
            //console.log(typeof(name))

            console.log(`the number of active clients are ${cli}`)
        } else if (data.command == 4) {

            //if (data.msg == "") {
            if (sockets[data.clientid].isInChat == false) {
                data2.chatMode = false;
                data2.hadQuit = false;

                sockets[data.clientid].requests.push(socket.username);
                socket.sentRequest.push[data.clientid];
                data2.success = true;
                data2.msg = `Request is sent to ${data.clientid}`
                socket.write(JSON.stringify(data2));
                data2.hadQuit = false;

            } else {
                data2.success = false;
                data2.msg = `${data.clientid} is not available for chat`
                socket.write(JSON.stringify(data2));

            }
            /*}  else {

                if (data.msg == "accept") {
                    socket.write(`You have accepted the request from ${data.clientid}`);
                    socket.patner = data.clientid;
                    sockets[data.clientid].patner = socket.username;
                    socket.isInChat = true;
                    sockets[data.clientid].isInChat = true;
                    sockets[socket.patner].write("Your request is being accepted");
                }
                else if (sockets[socket.username].patner != data.clientid) {
                    data2.msg="Your request is not accepted yet"
                    socket.write(JSON.stringify(data2));
                }
                else if (data.msg == "quit") {

                    sockets[socket.username].write(`You have terminated the session with ${socket.patner}\n`);
                    if (sockets[data.clientid]) {
                        sockets[socket.patner].write(`Your session with ${socket.username} has been terminated`)
                    }
                    if (socket.requests.indexOf(socket.patner) != -1) {
                        socket.requests.pop(socket.patner);
                    }
                    if (sockets[socket.patner].requests.indexOf(socket.username) != -1) {
                        sockets[socket.patner].requests.pop("socket.username");
                    }
                    socket.isInChat = false;
                    sockets[socket.patner].isInChat = false;
                    sockets[socket.patner].patner = ""
                    socket.patner = "";
                    data.command = "";

                    exit;



                    //delete sockets[socket.username]
                    //socket.destroy()

                    /*if(sockets[data.clientid]) {
                        sockets[data.clientid].destroy();
                        delete sockets[data.clientid]
                    }*/
            //}
            //else sockets[socket.patner].write(data.uname + ": " + data.msg);
            //} */

        } else if (data.command == -1) {
            data2.hadQuit = false;
            var req = "";
            socket.requests.forEach(person => {
                req += person + ",";
            })
            if (req.length == 0) {
                data2.success = false;
                data2.msg = "Sorry, you have no requests"
            } else {
                data2.success = true;

                data2.msg = req;
            }
            socket.write(JSON.stringify(data2))
        } else if (data.command == -2) {

            socket.patner = data.clientid;
            sockets[socket.patner].patner = socket.username;
            socket.isInChat = true;
            sockets[socket.patner].isInChat = true;
            data2.success = true;
            data2.chatMode = true;
            data2.msg = `You have accepted the request from ${data.clientid}`
            data2.hadQuit = false;
            socket.write(JSON.stringify(data2));
            data2.msg = "Your request is being accepted"
            sockets[socket.patner].write(JSON.stringify(data2));
        } else if (data.command == -3) {
            data2.success = true;
            data2.msg = `${socket.username}: ${data.msg}`
            sockets[socket.patner].write(JSON.stringify(data2));
        }
        else if (data.command == -9) {
            //console.log("selected command is: "+data.command);
            var grpinfo = {
                name: data.clientid,
                admin: socket.username,
                participants: []
            }
            groups[data.clientid] = grpinfo;
            groups[data.clientid].participants.push(socket.username)
            data2.success = true;

            data2.msg = `you have created group ${data.clientid}`
            //console.log("groups are: "+Object.keys(groups));
            socket.write(JSON.stringify(data2));
            //console.log(JSON.stringify(data2));
        }
        else if (data.command == "group chatting") {
            data2.success = true;
            socket.grpPatner = data.clientid;
            data2.msg = "group chat is started";
            if (groups[socket.grpPatner].participants.indexOf(socket.username) == -1) {
                groups[socket.grpPatner].participants.push(socket.username);
            }
            socket.write(JSON.stringify(data2));
        } else if (data.command == "groupQuit") {
            data2.msg = `${socket.username} has left the chat`;
            data2.success = true;
            groups[socket.grpPatner].participants.forEach(person => {
                if (person != socket.username) {

                    sockets[person].write(JSON.stringify(data2));
                }
            })
            data2.success = true;
            data2.msg = "You have left the group";
            groups[socket.grpPatner].participants.splice(groups[socket.grpPatner].participants.indexOf(socket.username), 1);
            console.log(`current participants in ${socket.grpPatner} are ${groups[socket.grpPatner].participants}`);
            socket.write(JSON.stringify(data2));
        }
        else if (data.command == -10 || data.command == "group session" || data.command == "deletegroupList") {
            //console.log("command is: "+data.command)
            var grps = "";
            Object.keys(groups).forEach(grp => {
                grps += grp + ", ";
            })
            data2.msg2 = grps;
            if (grps.length > 0) {

                data2.msg = "The active groups are: " + grps
                data2.success = true;

                socket.write(JSON.stringify(data2));
            } else {
                data2.success = false;
                data2.msg = "Sorry, there are no active groups to join";
                socket.write(JSON.stringify(data2));
            }

        } else if (data.command == "group chat") {

            socket.isInGroup = true;
            //groups[data.clientid].participants.push(socket.username);
            groups[socket.grpPatner].participants.forEach(person => {
                if (person != socket.username) {
                    data2.msg = `${socket.username}: ${data.msg}`
                    data2.success = true;
                    sockets[person].write(JSON.stringify(data2));
                }

            })

        }
        else if (data.command == "chatting") {
            data2.success = true;
            data2.msg = `1:1 session started between you and ${socket.patner}`
            socket.write(JSON.stringify(data2));

        } else if (data.command == "logout") {
            if (socket.sentRequest.length > 0) {
                console.log(sockets[person].requests);
                socket.sentRequest.forEach(person => {
                    var index = sockets[person].requests(socket);
                    sockets[person].requests.splice(index, 1);
                    console.log(sockets[person].requests);
                })
            }

            delete sockets[socket.username];
            data2.success = true;
            data2.msg = "Logged out";
            socket.write(JSON.stringify(data2));
        }
        else if (data.command == "deleteGroup") {
            if (socket.username == groups[data.clientid].admin) {
                delete groups[data.clientid];
                console.log(`Active groups are: ${Object.keys(groups)}`);
                data2.success = true;
                data2.msg = `Group ${data.clientid} successfully deleted`;
                socket.write(JSON.stringify(data2));
            } else {
                data2.success = false;
                data2.msg = `Sorry, only admin  ${groups[data.clientid].admin} has permission to delete the group`;
                socket.write(JSON.stringify(data2));
            }
        } else if (data.command == "editInfo") {
            var decrypt = crypto.privateDecrypt(privateKey, Buffer.from(data.pass.toString("base64"), "base64"));
            data.pass = decrypt.toString();
            /* console.log("username: "+data.uname);
            console.log("password: "+data.pass); */
            mongoose.set("strictQuery", false);
            mongoose.connect("mongodb://127.0.0.1:27017/assignment", {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }, (err) => {
                if (err) {
                    console.log("error: " + err);
                } else {

                }

                var userModel = mongoose.model('users', userSchema);
                userModel.findOneAndUpdate({ username: data.uname, password: data.pass }, { username: data.u, password: data.p }, null, function (err, docs) {
                    if (err) console.log(err);
                    else {
                        console.log(docs);
                    }
                });

                data2.success = true;
                data2.msg = "username and password updated";
                socket.username=data.u;
                socket.write(JSON.stringify(data2));
            })

        }
        else if (data.command == "quit") {
            //data2.msg=`You have terminated the session with ${socket.patner}`;
            data2.success = true;
            socket.write(JSON.stringify(data2));
            socket.isInChat = false;
            sockets[socket.patner].isInChat = false;
            //data2.msg=`Session is terminated by ${socket.username}`;
            data2.hadQuit = true;
            sockets[socket.patner].write(JSON.stringify(data2));
        } else if (data.command == "exitCommand") {
            delete sockets[socket.username];
            data2.msg = "Exited";
            data2.success = true;
            socket.write(JSON.stringify(data2));
        }
        else if (data.command == "quitting") {
            data2.hadQuit = false;
            if (socket.requests.indexOf(socket.patner) != -1) {
                socket.requests.splice(socket.requests.indexOf(socket.patner), 1);
            }
            data2.msg = `session terminated between you and ${socket.patner}`;
            //console.log(sockets[socket.patner].patner)

            socket.patner = "";
            //console.log(`patner of ${socket.username} is ${socket.patner}`);
            data2.success = true;
            socket.write(JSON.stringify(data2));
            //console.log("command is: "+data.command);

        } else if (data.command = "neutral") {
            data2.success = true;
            socket.write(JSON.stringify(data2));
            data2.command = "";
            data2.hatQuit = false;
        }
        else if (data.command == 5) {
            socket.username = data.uname;
            sockets[socket.username] = socket;
            if (data.msg == "") {
                groups[data.clientid].participants.push(socket.username);
                console.log("Active clients are: " + groups[data.clientid].participants);
                socket.write("You have joined the group " + data.clientid);
                groups[data.clientid].participants.forEach(socket1 => {
                    if (socket1 != socket.username) {
                        sockets[socket1].write(`${data.uname} has joined the group chat`);
                    }
                })

            } else {
                if (sockets[socket.username].part)
                    var message = "";
                if (data.msg == "quit") {
                    message += `${data.uname} has left the chat`;
                    groups[data.clientid].participants.pop(socket.username);
                    socket.write("You have left the group chat");
                    socket.destroy();
                    delete sockets[socket.username];
                    console.log(`Active participants are: ${groups[data.clientid].participants}`)
                    groups[data.clientid].participants.forEach(socket1 => {
                        if (socket1 != socket.username) {
                            sockets[socket1].write(message);
                        }

                    })

                    socket.write("you have left the chat");
                    socket.destroy();
                    delete sockets[socket.username]


                } else if (data.msg == "close") {
                    if (groups[data.clientid].admin == socket.username) {
                        groups[data.clientid].participants.forEach(person => {
                            if (person != socket.username) {
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
                    } else {
                        socket.write("Only admin  has permission to close the group");
                    }
                }
                else {
                    message += data.uname + ": " + data.msg;
                    groups[data.clientid].participants.forEach(socket1 => {
                        if (socket1 != socket.username) {
                            sockets[socket1].write(message);

                        }
                    })
                }

            }
        } else if (data.command == 6) {
            socket.username = data.uname;
            sockets[socket.username] = socket;

            if (data.msg == "") {
                var grpinfo = {
                    name: data.clientid,
                    admin: socket.username,
                    participants: []
                }
                groups[data.clientid] = grpinfo;
                groups[data.clientid].participants.push(socket.username);
                socket.write(`Group ${data.clientid} is created`);
                console.log(`Group ${data.clientid} is created by ${socket.username}`);
                console.log("Active participants: " + groups[data.clientid].participants);
            } else {
                if (data.msg == "close") {
                    if (socket.username == groups[data.clientid].admin) {
                        groups[data.clientid].participants.forEach(person => {
                            if (person != socket.username) {
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
                    } else {
                        socket.write("Only admin has permission to close the group");
                    }
                } else if (data.msg == "quit") {
                    //groups[data.clientid].participants.pop(socket.username);
                    groups[data.clientid].participants.splice(0, 1)
                    console.log(`Active participants in the group are: ${groups[data.clientid].participants}`);
                    console.log(`New admin for ${data.clientid} is ${groups[data.clientid].participants[0]}`);
                    if (groups[data.clientid].admin == socket.username)
                        groups[data.clientid].admin = groups[data.clientid].participants[0];
                    groups[data.clientid].participants.forEach(person => {
                        if (person != socket.username) {
                            sockets[person].write(socket.username + " has left from the chat\n");
                            //if(groups[data.clientid].admin==socket.username){ 
                            sockets[person].write(`${groups[data.clientid].admin} is now admin`);

                        }
                    })
                    socket.write("You left the group\nConnect again");
                    socket.destroy();

                    delete sockets[socket.username];
                    console.log(`Active groups are: ${Object.keys(groups)}`);
                    console.log(`Active Participants are: ${Object.keys(sockets)}`);

                } else {
                    groups[data.clientid].participants.forEach(person => {
                        if (person != socket.username) {
                            sockets[person].write(socket.username + ": " + data.msg);
                        }
                    })
                }
            }

        } else if (data.command == 7) {
            //socket.username=data.uname;


            var req = ""
            if (sockets[socket.username].requests.length > 0) {
                sockets[socket.username].requests.forEach(person => {
                    req += person + ",";
                })
                socket.write(`Requests are from: ${req}`);
            } else {
                socket.write("you have no requests");
            }

        } else if (data.command == 8) {
            socket.patner = data.clientid;
            sockets[data.clientid].patner = socket.username;
            socket.isInChat = true;
            sockets[data.clientid].isInChat = true;
            socket.write(`You have accepted the request from ${data.clientid}`);
            sockets[data.clientid].write(`Your request to ${socket.username} is accepted.\n`)

        }
    })
    socket.on("error", () => {
        console.log(`${socket.username} is disconnected`);
        delete sockets[socket.username]
        socket.destroy();
        console.log(`the number of active clients are ${Object.keys(sockets).length}`)
    })



})
server.listen(1235);