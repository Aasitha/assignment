const net=require("net")
var term = require( 'terminal-kit' ).terminal ;
var data={
    
}
var items=[ '1.view online clients',
            '2.start 1:1 session',
            '3.start groupchat'
          ]
const readLine = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const waitForUsername = new Promise(resolve => {
    readLine.question('Enter a username to join the chat: ', answer => {
        resolve(answer);
        
    });
});
waitForUsername.then((username)=>{
    data.uname=username;
    term.(items,function(err,response){
        term('\n').eraseLineAfter.green();
        data.command=response.selectedIndex
        if(data.command==2){
            readLine.question("Enter clientid",(ans)=>{
                data.clientID=ans;
            })
        }else{

        }

    })
    const socket=net.connect({
        port:1235
    })
    socket.on("connect",()=>{
        socket.write(JSON.stringify(data));
    })

})