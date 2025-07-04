const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv');

dotEnv.config();

const secretKey = process.env.WhatIsYourName;

const vendorRegister = async(req,res)=>{
    const {username,email,password}= req.body;
    try{
        const vendorEmail = await Vendor.findOne({email});
        if (vendorEmail){
            return res.status(400).json({message : "Email Already Exist"})
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        });
        await newVendor.save();
        res.status(201).json({message: "Vendor Register Successfully"});
        console.log("Vendor Register");
    }
    catch(error){
        console.log("Registration Error:",error);
        res.status(500).json({error : error.message});
    }
}

const venderLogin = async(req,res)=>{
    const {email,password} = req.body;
    try{
        const vendor = await Vendor.findOne({email});
        if(!vendor || !(await bcrypt.compare(password,vendor.password)) ){
            return res.status(400).json({error: "Invalid Password"})
        }
            const token= jwt.sign({vendorId : vendor._id},secretKey,{expiresIn:"1hr"})

            const vendorId = vendor._id;

            res.status(200).json({message:"Login succesful",token,vendorId})
            console.log(email,"this is token",token);

    }
    catch(error){
        console.log(error);
        res.status(500).json({error: "Internal Server Error"})
    }
}


const getAllVendors = async(req,res)=>{
    try {
        const vendors = await Vendor.find().populate('firm');
        res.json({vendors});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal Server Error"})
    }
}

const getVendorById = async (req, res) => {
    const vendorId = req.params.id;

    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');

        if (!vendor) {
            return res.status(404).json({ error: "Vendor Not Found" });
        }

        let vendorFirmId = null;

        // Safely check and extract firm ID
        if (Array.isArray(vendor.firm) && vendor.firm.length > 0) {
            vendorFirmId = vendor.firm[0]._id;
        } else if (vendor.firm && vendor.firm._id) {
            vendorFirmId = vendor.firm._id;
        }

        res.status(200).json({ vendorId, vendorFirmId, vendor });
        console.log("Vendor:", vendor);
        console.log("Firm ID:", vendorFirmId);

    } catch (error) {
        console.log("Error in getVendorById:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports={vendorRegister,venderLogin,getAllVendors,getVendorById};