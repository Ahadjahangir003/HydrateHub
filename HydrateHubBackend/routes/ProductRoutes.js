// routes/ProductRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/ProductModel');
const Rating = require('../models/RatingModel');
const multer = require("multer");
const path = require("path");
const fs = require("fs");

//FOR IMAGE
const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null, "./uploads/")
  },
  filename: function(req, file,cb){
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({storage: storage});


router.get("/vendor-products/:vendorId", async (req, res) => {
  const { vendorId } = req.params;
  try {
    const vendorProducts = await Product.find({ vendorId });
    res.status(200).json(vendorProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// CREATE PRODUCT
router.post("/add-product", upload.single("image"), async (req, res) => {
  const { title, price, details, stock, vendorEmail, vendorId, vendor } = req.body;
  try {
    const productAdded = await Product.create({
      title: title,
      price: price,
      details: details,
      stock: stock,
      vendorId: vendorId,
      vendorEmail: vendorEmail,
      vendor: vendor,
      image: req.file ? req.file.filename : null, // Store the filename, not the field name
    });

    res.status(201).json(productAdded);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});



//GET PRODUCT
router.get("/all-products", async (req, res) => {
  try {
    const allProduct = await Product.find();

    res.status(200).json(allProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/all-products-user", async (req, res) => {
  try {
    const allProduct = await Product.find();

    const allProductUser = await Promise.all(allProduct.map(async (product) => {
      const ratingss = await Rating.find({ pId: product._id });
      const averageRating = ratingss.length ? (ratingss.reduce((acc, ratings) => acc + ratings.rating, 0) / ratingss.length) : 0;
      return {
          ...product._doc,
          averageRating,
          ratingCount: ratingss.length
      };
  }));
    res.status(200).json(allProductUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  //GET SINGLE PRODUCT
  router.get("/single-product/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const singlProduct = await Product.findById({ _id: id });
      res.status(200).json(singlProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// DELETE PRODUCT
router.delete("/delete-product/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete({ _id: id });
    if (deletedProduct && deletedProduct.image) {
      const imagePath = path.join(__dirname, "../uploads", deletedProduct.image);
      fs.unlinkSync(imagePath);
    }
    res.status(200).json(deletedProduct); // Respond with deleted product
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/edit-stock/:id' ,async(req,res)=>{

    const {id}=req.params;
    const {quantity}=req.body;

    try{
      const product = await Product.findById(id); // Fetch the product first
      const product1=await Product.findByIdAndUpdate(id,{
        $set: { stock: product.stock - quantity }, // Update stock properly
      })
      res.status(200).json(product1);
    }
    catch(error){
      res.status(400).json({ error: error.message });
    }
  })
router.patch('/edit-stock-return/:id' ,async(req,res)=>{

    const {id}=req.params;
    const {quantity}=req.body;

    try{
      const product = await Product.findById(id); // Fetch the product first
      const product1=await Product.findByIdAndUpdate(id,{
        $set: { stock: product.stock + Number( quantity )}, // Update stock properly
      })
      res.status(200).json(product1);
    }
    catch(error){
      res.status(400).json({ error: error.message });
    }
  })

router.patch('/edit-stock-vendor/:id' ,async(req,res)=>{

    const {id}=req.params;
    const {quantity}=req.body;

    try{
      const product=await Product.findByIdAndUpdate(id,{
        stock:quantity,
      },{
        new:true
      })
      res.status(200).json(product);
    }
    catch(error){
      res.status(400).json({ error: error.message });
    }
  })

  //UPDATE
  router.patch("/edit-product/:id", upload.single("image"), async (req, res) => {
    const { id } = req.params;
    const {title, price, details, stock } = req.body;

    
    try {
      const existingProduct = await Product.findById(id);
      const updatedPrduct = await Product.findByIdAndUpdate(
        id, 
        {
        title : title,
        price: price,
        details : details,
        stock : stock,
        image : req.file ? req.file.filename : req.body.filename,
        },
        {
        new: true,
      });
      if(req.file && existingProduct.image && req.file.filename !== existingProduct.image) {
        const imagePath = path.join(__dirname, "../uploads", existingProduct.image);
        fs.unlinkSync(imagePath);
      }
      res.status(200).json(updatedPrduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

module.exports = router;




