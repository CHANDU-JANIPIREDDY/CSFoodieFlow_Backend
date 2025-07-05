const express = require('express');
const dotEnv = require('dotenv');
const mongoose = require("mongoose");
const cors = require('cors');
const path = require('path')

const vendorRoutes = require('./vendors/vendorRoutes');
const bodyParser = require('body-parser');
const firmRoutes = require('./vendors/firmRoutes');
const productRoutes=require('./vendors/productRoutes');



const app=express()
dotEnv.config()
 
app.use(cors());
app.use(express.json());
console.log("🔍 MONGODB_URI:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log("Mongo DB Connected Successfully"))
.catch((err)=>console.log(err))

const port = process.env.PORT || 4000;
app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/product',productRoutes); 
app.use('/uploads',express.static('uploads'));


app.listen(port,()=>{
    console.log("Server Started Successfully")
})

app.get('/',(req,res)=>{
    res.send("JANIPIREDY CHANDU")
})