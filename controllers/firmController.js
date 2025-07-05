const { response } = require('express');
const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path');

    

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const uploads = multer({ storage });

const addFirm = async(req,res)=>{
    try {
        const {firmname , area,category,region,offer}= req.body;
        const image = req.file ? req.file.filename: undefined;

        const vendor = await Vendor.findById(req.vendorId)
        if(!vendor){
            return res.status(404).json({message:"Vendor Not Found"})
        }
        if(vendor.firm.length >0){
            return res.status(400).json({message: "vendor can have only one firm"});
        }
        const firm = new Firm({
            firmname,area,category,region,offer,image,vendor:vendor._id
        })
        const savedFirm=await firm.save()
        const firmId=savedFirm._id

        vendor.firm.push(savedFirm)
        await vendor.save()

    return res.status(200).json({message:'Firm Added Successful',firmId})
        
    } catch (error) {
        console.error("AddFirm Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
}

const deletedFirmById = async(req,res)=>{
    try {
        const firmId = req.params.firmId;
        const deletedFirm = await Firm.findByIdAndDelete(firmId);
        if(!deletedFirm){
            return res.status(404).json({error:"No Firm Found"})
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({error:'Internal Server Error'})    
    }
}


module.exports = {addFirm: [uploads.single('image'),addFirm],deletedFirmById}