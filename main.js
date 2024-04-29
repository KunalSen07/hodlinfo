const express=require("express")
const session=require("express-session")
const mongoose=require("mongoose")
const ApiStore=require("./model/model")
const axios =require("axios")
const app=express()
app.use(express.json())
app.set('view engine', 'ejs')
app.use(session({
    secret:"my-secrest-Key",
    resave: false,
    saveUninitialized: true,
}))
app.use ((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).send(err.stack);
})
mongoose.connect("mongodb://localhost:27017/ApiStore")
    .then((data)=>{
         console.log("data");
    })
    .catch((err)=>{
         console.log(err);
     })

     app.get("/fetch",async(req,res)=>{
        try{
            const response =await axios.get("https://api.wazirx.com/api/v2/tickers",{
                timeout:10000
            })
            const tickets = response.data;
            if (!tickets) {
                throw new Error("No data received from API");
            }
            const tenTickets=Object.values(tickets).slice(0,10)

            if (!Array.isArray(tenTickets)) {
                throw new Error("Invalid data format: tenTickets is not an array");
            }
            await Promise.all(tenTickets.map(async ticket=>{
                const differnce=(ticket.sell-ticket.buy).toFixed(2)
                await ApiStore.create({
                    name: ticket.name,
                    last: ticket.last,
                    buy: ticket.buy,
                    sell: ticket.sell,
                    volume: ticket.volume,
                    differnce:differnce,
                    base_unit: ticket.base_unit
            
                })
            }))
            res.send("Data is fetch and stored in the mongoose")
        }
        catch(err){
            console.log("error:",err)
            res.status(500).send("Internal fetch error");
              
        }
     })
     app.get("/", async (req, res) => {
        try {
            const data = await ApiStore.find({}).limit(10);
            res.render("appear", { data: data });
        } catch (err) {
            console.error("Error fetching data from MongoDB:", err);
            res.status(500).send("Internal show error");
        }
    });
app.listen(3000,()=>{
    console.log("server is running at 30000")
})