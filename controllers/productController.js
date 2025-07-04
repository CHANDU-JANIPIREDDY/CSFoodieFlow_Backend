const Firm = require('../models/Firm');
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Folder where files will be saved
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // e.g., 168945123123.jpg
    }
});
const uploads=multer({storage:storage})

const addProduct =  async(req,res)=>{
    try {
        const {productname,price,category,bestseller,description} = req.body;
        const image = req.file ? req.file.filename: undefined;
        const firmId=req.params.firmId;
        const firm = await Firm.findById(firmId);
        if (!firm){
            return res.status(404).json({error: "No Firm Found"});
        }
        const product = new Product({
            productname,price,category,bestseller,description,image,firm: firm._id
        })
        const savedProduct = await product.save();
        firm.products.push(savedProduct);
        await firm.save();

        res.status(200).json(savedProduct);



    } catch (error) {
        console.error(error);
        res.status(500).json({error:'Internal Server Error'})
    }
}

const getProductByFirm = async(req,res)=>{
   try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);
    if(!firm){
        return res.status(404).json({error: "No Firm Found"})
    }
    const restaurentName = firm.firmname
    const products = await Product.find({firm:firmId});
    res.status(200).json({restaurentName,products});

   } catch (error) {
        console.error(error);
        res.status(500).json({error:'Internal Server Error'})
   }
}

const deletedProductById = async(req,res)=>{
    try {
        const productId = req.params.productId;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if(!deletedProduct){
            return res.status(404).json({error:"No Product Found"})
        }
        res.status(200).json({ message: "Product Deleted Successfully" }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({error:'Internal Server Error'})    
    }
}
module.exports = {addProduct:[uploads.single('image'),addProduct],getProductByFirm,deletedProductById}