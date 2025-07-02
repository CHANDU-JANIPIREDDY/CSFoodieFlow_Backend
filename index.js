const express = require('express');
const dotEnv = require('dotenv');
const mongoose = require("mongoose");
const cors = require('cors');
const path = require('path')

const vendorRoutes = require('./vendors/vendorRoutes');
const bodyParser = require('body-parser');
const firmRoutes = require('./vendors/fermRoutes');
const productRoutes=require('./vendors/productRoutes');



const app=express()
dotEnv.config()
 
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("Mongo DB Connected Successfully"))
.catch((err)=>console.log(err))

const port = process.env.PORT || 4000;
app.use(bodyParser.json());
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