const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")


const app =express()
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todolistDB")

itemSchema = {
    name:{
        type:String,
        required:true
    }
}
const Item = mongoose.model("Item",itemSchema)



app.get("/",(req,res)=>{
    var day = new Date()
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };

    let text = day.toLocaleDateString("en-US",options)
    let items = []
    Item.find({},function (err, itemsFromDB) {
        if (err){
            console.log(err)
        }else {
            itemsFromDB.forEach(function (i) {
                items.push(i)
            })
            // console.log(items)
            res.render("list",{dayOfWeek:text,items:items})
        }
    })
    
})

app.post("/",function (req,res) {
    const itemToAdd = new Item({
        name:req.body.newItem
    })
    itemToAdd.save()
    console.log(req.body.newItem)
    res.redirect("/")
})

app.post("/delete", function (req,res) {
    const checkedItem = req.body.checkbox.trim()
    console.log(checkedItem)
    Item.findByIdAndRemove(checkedItem,function(err) {
        if (!err){
            console.log("Successfully removed")
        }else{
            console.log(err)
        }
        res.redirect("/")
    })
})



app.listen(3000,function (req,res) {
    console.log("Listening at port 3000...")
})