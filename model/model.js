const mongoose=require("mongoose")
const enteries= new mongoose.Schema({
    name: String,
    last: Number,
    buy: Number,
    sell: Number,
    volume: Number,
    differnce:String,
    base_unit: String
})
module.exports=mongoose.model("ApiData", enteries)