var data={
    dommand:2,
    msg:"aasitha, rishiya, paavallika,"
}
var info=JSON.stringify(data);
var data2=JSON.parse(info)
console.log(data2.msg.split(", "));
console.log(typeof(data2.msg));