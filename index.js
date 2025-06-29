const express = require("express");
const dotEnv = require('dotenv');
const mongoose = require("mongoose");
const vendorRoutes = require('./vendors/vendorRoutes');
const bodyParser = require('body-parser');
const firmRoutes = require('./vendors/fermRoutes');
const productRoutes=require('./vendors/productRoutes');
const path = require('path')

const app=express()
dotEnv.config()
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("Mongo DB Connected Successfully"))
.catch((err)=>console.log(err))

const port =4000;
app.use(bodyParser.json());
app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/product',productRoutes); 
app.use('/uploads',express.static('uploads'));


app.listen(port,()=>{
    console.log("Server Started Successfully")
})

app.get('/',(req,res)=>{
    res.send("CHANDU.JANIPIREDDY")
})