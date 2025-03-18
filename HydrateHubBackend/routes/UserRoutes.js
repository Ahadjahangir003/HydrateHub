// userRoutes.js
const path = require("path"); // Add this line at the top
const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const Partner = require('../models/PartnerModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require("multer");
const fs = require("fs");

const secretKey = "Ahad";
const emailConfig = {
  service: 'gmail',
  auth: {
    user: 'hydratehub003@gmail.com',
    pass: 'yewx scol ziom rlhr',
  },
};

// Configure nodemailer
const transporter = nodemailer.createTransport(emailConfig);

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
      return res.status(401).json({ message: 'No token provided' });
  }

  try {
      const decoded = jwt.verify(token, secretKey);
      req.user = await User.findById(decoded.userId).select('-password');
      if (!req.user) {
        req.user=await Partner.findById(decoded.userId).select('-password');
      if (!req.user) {
          return res.status(401).json({ message: 'Invalid token' });
      }}
      next();
  } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
  }
};

router.post('/signup', async (req, res) => {
  try {
    console.log('Starting signup process...');

    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email address already in use' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword,
    });

    await newUser.save();

    const verificationPin = Math.floor(100000 + Math.random() * 900000).toString();    
    newUser.verificationPin = verificationPin;
    newUser.verificationPinCreatedAt=new Date();
    await newUser.save();

    const mailOptions = {
      from: '"HydrateHub" <hydratehub003@gmail.com>', // Replace with your email
      to: req.body.email,
      subject: 'HydrateHub Email Verification',
      html: `Welcome ${req.body.name}<br> Your verification pin is: ${verificationPin}`,
    };
    await transporter.sendMail(mailOptions);
    console.log('Signup process completed successfully.');

    res.json({ message: 'Verification pin sent. Check your email to verify.' });
  } catch (error) {
    console.error('Error during signup:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/request-reset-password', async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
    user = await Partner.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: 'Email not found' });
    }}

    const verificationPin = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.verificationPin = verificationPin;
    user.verificationPinCreatedAt=new Date();
    await user.save();

    const mailOptions = {
      from: '"HydrateHub" <hydratehub003@gmail.com>', // Replace with your email
      to: req.body.email,
      subject: 'HydrateHub Password Reset',
      html: `Hello ${user.name},<br> Your password reset pin is: ${verificationPin}. Use this pin to reset your password.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset pin sent. Check your email to reset your password.' });
  } catch (error) {
    console.error('Error during password reset request:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.post('/verify-pin', async (req, res) => {
  try {
    const enteredPin = req.body.pin;
    
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
    user = await Partner.findOne({ email: req.body.email });
    if (!user) {
    return res.status(400).json({ message: 'User not found' });
    }}

    if (user.verificationPin !== enteredPin) {
      return res.status(401).json({ message: 'Incorrect verification pin' });
    }

    // Check if pin is expired
    const currentTime = new Date();
    const pinCreationTime = user.verificationPinCreatedAt; // Assume you have a field storing the pin creation time

    // Set the expiration time to, for example, 10 minutes
    const pinExpirationTime = new Date(pinCreationTime.getTime() + 5 * 60 * 1000);

    if (currentTime > pinExpirationTime) {
      // Pin has expired
      user.verificationPin = null;
      await user.save();
      return res.status(401).json({ message: 'Verification pin has expired' });
    }

    user.isVerified = true;
    user.verificationPin = null;
    await user.save();

    res.json({ message: 'Email verified successfully. Sign in now.' });

  } catch (error) {
    console.error('Error during pin verification:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});  
router.post('/resend-pin', async (req, res) => {
  try {
    const userEmail = req.body.email;
    let user = await User.findOne({ email: userEmail });

    if (!user) {
      user = await Partner.findOne({ email: userEmail });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }}

    // Check if there is an existing unexpired pin


    // Generate a new 6-digit pin
    const newVerificationPin = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the new pin and update the creation time
    user.verificationPin = newVerificationPin;
    user.verificationPinCreatedAt = new Date();
    await user.save();

    // Send the new pin to the user via email
    const mailOptions = {
      from: '"HydrateHub" <hydratehub003@gmail.com>',
      to: userEmail,
      subject: 'HydrateHub Email Verification',
      html: `Hello <br> Your new verification pin is: ${newVerificationPin}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'New verification pin sent. Check your email to verify.' });
  } catch (error) {
    console.error('Error during pin resend:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/reset-password', async (req, res) => {
    try {
      let user = await User.findOne({ email: req.body.email });
  
      if (!user) {
        user = await Partner.findOne({ email: req.body.email });
        if(!user){  
        return res.status(400).json({ message: 'User not found' });}
      }
  
      // Update the password with the new one
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      user.password = hashedPassword;
      
      // Clear the reset pin
      user.resetPin = null;
  
      await user.save();
  
      res.json({ message: 'Password reset successful. You can now login with your new password.' });
    } catch (error) {
      console.error('Error during password reset:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
    
  router.get('/count', async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      res.json({ count: totalUsers });
    } catch (error) {
      console.error('Error getting total users count:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

router.post('/loginUser', async (req, res) => {
    try {
        
            let user; 
            user= await User.findOne({ email: req.body.email });
            
            if (!user) {
                    return res.status(401).json({ message: 'User account not found!' });    
              }
              
            const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Incorrect password!' });
            }
            if(user.isVerified===false){
                return res.status(401).json({ message: 'User is not verified! Reset Password to verify.' });
            }
            const token = jwt.sign({ userId: user._id, name: user.name, userEmail:user.email }, secretKey, {
                expiresIn: '10d',
            });
    
            res.json({ message: 'Login successful', token });
        
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
);


router.post('/loginVendor', async (req, res) => {
    try {
                  const  user= await Partner.findOne({email: req.body.email});
                  if(!user){
                    return res.status(401).json({ message: 'Vendor account not found!' });    
              }
              
            const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Incorrect password!' });
            }
            if(user.isVerified===false){
                return res.status(401).json({ message: 'User is not verified! Reset Password to verify.' });
            }
            const token = jwt.sign({ userId: user._id, name: user.name, userEmail:user.email, cname: user.companyName }, secretKey, {
                expiresIn: '10d',
            });
    
            res.json({ message: 'Login successful', token });
        
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
);

router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById({_id:userId});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/partner/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await Partner.findById({_id:userId});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to fetch all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching all users:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/partner-read', async (req, res) => {
  try {
    const users = await Partner.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching all Partners:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.delete("/delUser/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleUser = await User.findByIdAndDelete({
      _id: id,
    });

    if (singleUser) {
      const mailOptions = {
        from: '"HydrateHub" <hydratehub003@gmail.com>',
        to: singleUser.email,
        subject: 'Account Deletion Notice',
        html: `Hello ${singleUser.name},<br><br>Your account has been deleted due to violations of our terms of service.`,
      };
      await transporter.sendMail(mailOptions);
    }

    res.status(200).json(singleUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Update delete partner route
router.delete("/delPartner/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleUser = await Partner.findByIdAndDelete({
      _id: id,
    });

    if (singleUser) {
      const mailOptions = {
        from: '"HydrateHub" <hydratehub003@gmail.com>',
        to: singleUser.email,
        subject: 'Account Deletion Notice',
        html: `Hello ${singleUser.name},<br><br>Your account has been deleted due to violations of our terms of service.`,
      };
      await transporter.sendMail(mailOptions);
    }

    res.status(200).json(singleUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
router.patch("/userUpdate/:userId", async (req, res) => {
  const userId = req.params.userId;
  const {
    name,
    email,
    phone,
    address,
  } = req.body;

  try {
    const updatedUserData = {
      name: name,
      email: email,
      phone: phone,
      address: address,
    };

    // Update the user with new data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...updatedUserData,
      },
      { new: true }
    );
    


    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Specify the folder where images will be saved
  },
  filename: function(req, file,cb){
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage: storage });

router.patch("/partnerUpdate/:userId", upload.single("image"), async (req, res) => {
  const userId = req.params.userId;
  const existingUser = await Partner.findById(userId);

  const { name, email, cnic, phone, about, companyName, location } = req.body;

  try {
    // Build updated user data
    const updatedData = {
      name,
      email,
      cnic,
      phone,
      about,
      companyName,
      location,
      image: req.file ? req.file.filename : existingUser.image, // Use new file or existing image
    };

    // If a new file is uploaded, delete the old one
    if (req.file && existingUser.image && req.file.filename !== existingUser.image) {
      const oldImagePath = path.join(__dirname, "../uploads", existingUser.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete the old image
      }
    }

    // Update the user in the database
    const updatedUser = await Partner.findByIdAndUpdate(userId, updatedData, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating vendor info:", error);
    res.status(500).json({ error: error.message });
  }
});



router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  const mailOptions = {
    from: '"HydrateHub" <hydratehub003@gmail.com>',
    to: 'hydratehub003@gmail.com',
    subject: `Contact Form Submission: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ error: 'Failed to send email' });
  }
});

router.patch('/change-password', authenticate, async (req, res) => {
  try {
      const { oldPassword, newPassword } = req.body;

      // Validate inputs
      if (!oldPassword || !newPassword) {
          return res.status(400).json({ message: 'Old and new passwords are required' });
      }

      // Find the user in the database
      const user = await User.findById(req.user.id); // `req.user.id` should come from your auth middleware
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Old password is incorrect' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


router.patch('/change-password-vendor', authenticate, async (req, res) => {
  try {
      const { oldPassword, newPassword } = req.body;

      // Validate inputs
      if (!oldPassword || !newPassword) {
          return res.status(400).json({ message: 'Old and new passwords are required' });
      }

      // Find the user in the database
      const user = await Partner.findById(req.user.id); // `req.user.id` should come from your auth middleware
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Old password is incorrect' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


router.patch('/add-to-cart/:userId', authenticate, async(req, res)=>{
  const { userId } = req.params;
  const { cartOrder } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.cart.push(cartOrder);
    await user.save();

    res.status(200).json({ message: 'Item added to cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
})

router.patch('/delete-from-cart/:userId', authenticate, async(req, res)=>{

  const { userId } = req.params;
  const { index } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (index < 0 || index >= user.cart.length) {
      return res.status(400).json({ message: 'Invalid index' });
    }

    user.cart.splice(index, 1);
    await user.save();

    res.status(200).json({ message: 'Item removed from cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }

})

router.patch('/order-completed/:userId', async(req, res)=>{

  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    user.cart=[]
    await user.save();

    res.status(200).json({ message: 'Cart cleared!', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }

})


module.exports = router;