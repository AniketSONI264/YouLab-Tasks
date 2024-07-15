const bodyParser = require('body-parser')
const express= require('express')
const app= express()
const port = process.env.PORT|| 3000
const mongoose = require('mongoose')

// app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use((req,res,next)=>{
    console.log(`Server is Up`)
    next()
})

mongoose.connect("mongodb://localhost:27017/DBUsers")
.then(()=> console.log("Connection Eshtablished Successfully..."))
.catch(err => console.error("Not Connected",err))

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        require :true,
        minlength:2
    },
    course:{
        type : String,
        required :true
    }
})

const User = mongoose.model("YourLab",userSchema)

app.get('/', (req,res)=>{
res.status(200).json({"message":"Deplyoed Successfully"})
})
app.get('/Showuser', async (req,res)=>{
    const DBusers = await User.find({ })
res.status(200).send(DBusers)
})

.route('/user/:id')
.get(async (req,res)=>{
    const person = User.findById(req.params.id);
    console.log("person:",person)
    if(!person) res.status(404).json({error:"USer not Found"})
    return res.status(200).json(person)
})

.patch(async (req,res)=>{
    try{
       const name = req.body.name;
    //    const course =req.body.course;
    console.log("name:",name);
        if(!name){
            return res.status(400).send({error:"All fields are required"});
        }
    
    const updateUser = await User.findByIdAndUpdate(req.params.id,{name},{new:true, runValidators: true})
    console.log("update :",updateUser)
    if(!updateUser) return res.status(404).send({"error":"User not found"})
    
    res.send(updateUser)
} catch(err){
    res.status(400).send(err)
}
})

.delete(async (req,res)=>{
const deletedUser= await User.findByIdAndDelete(req.params.id)
res.status(200).send(deletedUser)
})


app.post("/Postuser",async (req,res)=>{
    const body = req.body;
    if(
        !body || !body.name || !body.course
    ){
        return res.status(404).send("All fields are Required...")
    }

    const result = await User.create({
        name : req.body.name,
        course : req.body.course
    })
    console.log("Result : ",result)
    return res.status(201).json({"message":"Created SUccessfully"})
})


app.listen(port, ()=>{
console.log(`Server is Running at ${port}`)
})
