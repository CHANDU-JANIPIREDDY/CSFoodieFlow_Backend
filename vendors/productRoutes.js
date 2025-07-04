const express = require('express');
const productController = require('../controllers/productController');
const path = require('path'); // ✅ Add this

const router = express.Router();

router.post('/add-product/:firmId', productController.addProduct);
router.get('/:firmId/products', productController.getProductByFirm);

router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.setHeader('Content-Type', 'image/jpeg'); // ✅ Fix this
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});

router.delete('/:productId', productController.deletedProductById);

module.exports = router;
