const mongoose = require("mongoose");
mongoose.set("strictQuery",false);
mongoose.connect("mongodb://127.0.0.1:27017/assignment",{
    useNewUrlParser:true,
    useUnifiedTopology:true
},(err)=>{
    if(err){
        console.log("error "+err);
        res.send(err.toString());
    }else{
        console.log("successfully connected");
        //res.send("successfully connected");
    }
});
