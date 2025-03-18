// routes/packageRoutes.js
const express = require('express');
const router = express.Router();
const package = require('../models/PackageModel');
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






// CREATE package
router.post("/add-package", upload.single("image"), async (req, res) => {
  const { title, price, details, vendorEmail, vendorId, vendor} = req.body;
  try {
    const packageAdded = await package.create({
      title: title,
      price: price,
      details: details,
      vendorId: vendorId,
      vendorEmail: vendorEmail,
      vendor: vendor,
      image: req.file ? req.file.filename : null, // Store the filename, not the field name
    });

    res.status(201).json(packageAdded);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});



//GET package
router.get("/all-packages", async (req, res) => {
  try {
    const allpackage = await package.find();

    res.status(200).json(allpackage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/all-packages-user", async (req, res) => {
  try {
    const allPackage = await package.find();

    const allPackageUser = await Promise.all(allPackage.map(async (package) => {
      const ratingss = await Rating.find({ pId: package._id });
      const averageRating = ratingss.length ? (ratingss.reduce((acc, ratings) => acc + ratings.rating, 0) / ratingss.length) : 0;
      return {
          ...package._doc,
          averageRating,
          ratingCount: ratingss.length
      };
  }));
    res.status(200).json(allPackageUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  //GET SINGLE package
  router.get("/single-package/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const singlpackage = await package.findById({ _id: id });
      res.status(200).json(singlpackage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// DELETE package
router.delete("/delete-package/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedpackage = await package.findByIdAndDelete({ _id: id });
    if (deletedpackage && deletedpackage.image) {
      const imagePath = path.join(__dirname, "../uploads", deletedpackage.image);
      fs.unlinkSync(imagePath);
    }
    res.status(200).json(deletedpackage); // Respond with deleted package
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


  //UPDATE
  router.patch("/edit-package/:id", upload.single("image"), async (req, res) => {
    const { id } = req.params;
    const {title, price, details, } = req.body;

    
    try {
      const existingpackage = await package.findById(id);
      const updatedPrduct = await package.findByIdAndUpdate(
        id, 
        {
        title : title,
        price: price,
        details : details,
        image : req.file ? req.file.filename : req.body.filename,
        },
        {
        new: true,
      });
      if(req.file && existingpackage.image && req.file.filename !== existingpackage.image) {
        const imagePath = path.join(__dirname, "../uploads", existingpackage.image);
        fs.unlinkSync(imagePath);
      }
      res.status(200).json(updatedPrduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  router.get("/vendor-packages/:vendorId", async (req, res) => {
    const { vendorId } = req.params;
    try {
      const vendorPackage = await package.find({ vendorId });
      res.status(200).json(vendorPackage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;




