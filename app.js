const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")


const app =express()
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todolistDB")

// Initializing the schema of an item to be added to the database as a task
itemSchema = {
    name:{
        type:String,
        required:true
    }
}
const Item = mongoose.model("Item",itemSchema)


// Get request for '/' route
app.get("/",(req,res)=>{
    var day = new Date()
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };

    //Gets the current date and day
    let text = day.toLocaleDateString("en-US",options) 
    
    //Retrieves the stored tasks from the data base and renders it
    let items = []
    Item.find({},function (err, itemsFromDB) {
        if (err){
            console.log(err)
        }else {
            itemsFromDB.forEach(function (i) {
                items.push(i)
            })
            res.render("list",{dayOfWeek:text,items:items})
        }
    })
    
})

// Post request to '/' for adding new items to the database
app.post("/",function (req,res) {
    const itemToAdd = new Item({
        name:req.body.newItem
    })
    itemToAdd.save()
    console.log(req.body.newItem)
    res.redirect("/")
})

//Post request from the checkbox from to delete items from list
app.post("/delete", function (req,res) {
    const checkedItem = req.body.checkbox.trim()
    Item.findByIdAndRemove(checkedItem,function(err) {
        if (!err){
            console.log("Successfully removed")
        }else{
            console.log(err)
        }
        res.redirect("/")
    })
})


//Listens to 3000 for requests
app.listen(3000,function (req,res) {
    console.log("Listening at port 3000...")
})