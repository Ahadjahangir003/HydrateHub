// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/UserRoutes');
const productRoutes = require('./routes/ProductRoutes');
const packageRoutes = require('./routes/PackageRoute');
const adminRoutes = require('./routes/AdminRoutes');
const orderRoutes = require('./routes/OrderRoutes');
const ratingRoutes = require('./routes/RatingRoutes');
const dotenv =require('dotenv');
dotenv.config();
const app = express(); 
const PORT = process.env.PORT;
const path = require('path');



// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allow specific methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers if needed
  }));

app.use(bodyParser.json());
app.use(express.json());
// app.get('/' ,(req, res)=> res.status(200).json({messege:"Backend Deployed"}));

mongoose.connect(process.env.URI)
    .then(() => {
        app.listen(process.env.PORT, (err) => {
            if (err) console.log(err);
            console.log(`Server is running on port ${PORT}`);
            });
})
.catch((error) => {
      console.log("Error", error);
});
app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/package', packageRoutes);
app.use('/admin', adminRoutes);
app.use('/order', orderRoutes);
app.use('/rating', ratingRoutes);
