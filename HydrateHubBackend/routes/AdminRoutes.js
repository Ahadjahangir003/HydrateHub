const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const nodemailer = require("nodemailer");
const Partner = require("../models/PartnerModel"); // Ensure the correct path
const User = require("../models/UserModel"); // Ensure the correct path
const Product = require("../models/ProductModel"); // Ensure the correct path
const router = express.Router();

// Hardcoded admin credentials
const ADMIN_EMAIL = "admin@hydratehub.com";
const ADMIN_PASSWORD = "12qw12qw"; // Replace this with your hardcoded password

// JWT secret key
const JWT_SECRET = "superSecretKey"; // Use a strong secret key
const JWT_EXPIRATION = "10d"; // Token expiration time

const emailConfig = {
  service: 'gmail',
  auth: {
    user: 'hydratehub003@gmail.com',
    pass: 'yewx scol ziom rlhr',
  },
};
const transporter = nodemailer.createTransport(emailConfig);

// Middleware for verifying token
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Unauthorized or Expired token!" });
    }
    req.user = decoded;
    next();
  });
}

// Generate a random 8-character password
function generatePassword() {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

// Create vendor route
router.post("/create-vendor", verifyToken, async (req, res) => {
  try {
    const { companyName, name, email, phone, cnic, location } = req.body;

    // Check if email or phone already exists
    const existingVendor = await Partner.findOne({
      $or: [{ email }, { phone }, { cnic }],
    });

    if (existingVendor) {
      return res.status(400).json({
        message: "Email, phone, or CNIC already exists.",
      });
    }

    // Generate password and encrypt it
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create vendor
    const newVendor = new Partner({
      companyName,
      name,
      email,
      phone,
      cnic,
      password: hashedPassword,
      location,
      isVerified: true,
    });

    // Save to database
    await newVendor.save();

    // Send email with credentials
    const mailOptions = {
      from: '"HydrateHub" <hydratehub003@gmail.com>',
      to: email,
      subject: "Welcome to HydrateHub - Vendor Account Created",
      text: `Dear ${name},

Your vendor account has been successfully created.

Login Credentials:
Email: ${email}
Password: ${password}

Please keep these credentials secure. Thank you for joining us!

Best regards,
HydrateHub Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Vendor account created successfully. Login credentials sent to the provided email.",
    });
  } catch (error) {
    console.error("Error creating vendor:", error.message);
    res.status(500).json({
      message: "Failed to create vendor. Please try again later.",
    });
  }
});

// Get all partners route
router.get("/partners", async (req, res) => {
  try {
    const partners = await Partner.find(); // Fetch all partners from the database
    res.status(200).json(partners);
  } catch (error) {
    console.error("Error fetching partners:", error.message);
    res.status(500).json({
      message: "Failed to fetch partners. Please try again later.",
    });
  }
});
router.get("/products", verifyToken, async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all partners from the database
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({
      message: "Failed to fetch products. Please try again later.",
    });
  }
});
router.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find(); // Fetch all partners from the database
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching partners:", error.message);
    res.status(500).json({
      message: "Failed to fetch partners. Please try again later.",
    });
  }
});

// Update partner by ID route
router.put("/partner/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedPartner = await Partner.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedPartner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    res.status(200).json({
      message: "Partner updated successfully",
      partner: updatedPartner,
    });
  } catch (error) {
    console.error("Error updating partner:", error.message);
    res.status(500).json({
      message: "Failed to update partner. Please try again later.",
    });
  }
});

// Delete partner by ID route
router.delete("/partner/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPartner = await Partner.findByIdAndDelete(id);

    if (!deletedPartner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    // Send email notification to deleted account
    const mailOptions = {
      from: '"HydrateHub" <hydratehub003@gmail.com>',
      to: deletedPartner.email,
      subject: "Account Deletion Notification",
      text: `Dear ${deletedPartner.name},

Your vendor account has been deleted from HydrateHub. If you believe this was a mistake or have any questions, please contact our support team.
Best regards,
HydrateHub Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Partner deleted successfully and notification email sent.",
    });
  } catch (error) {
    console.error("Error deleting partner:", error.message);
    res.status(500).json({
      message: "Failed to delete partner. Please try again later.",
    });
  }
});


router.delete("/user/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send email notification to deleted account
    const mailOptions = {
      from: '"HydrateHub" <hydratehub003@gmail.com>',
      to: deletedUser.email,
      subject: "Account Deletion Notification",
      text: `Dear ${deletedUser.name},

Your user account has been deleted from HydrateHub. If you believe this was a mistake or have any questions, please contact our support team.
Best regards,
HydrateHub Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "User deleted successfully and notification email sent.",
    });
  } catch (error) {
    console.error("Error deleting partner:", error.message);
    res.status(500).json({
      message: "Failed to delete user. Please try again later.",
    });
  }
});

router.delete("/product/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Send email notification to deleted account
    const mailOptions = {
      from: '"HydrateHub" <hydratehub003@gmail.com>',
      to: deletedProduct.vendorEmail,
      subject: "Product Deletion Notification",
      text: `Dear ${deletedProduct.vendor} owner,
  Your product-${deletedProduct.title} has been deleted from HydrateHub. Contact Admin for more details.
  Best regards,
  HydrateHub Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "User deleted successfully and notification email sent.",
    });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({
      message: "Failed to delete user. Please try again later.",
    });
  }
});

// Login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Generate JWT
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    // Respond with token
    res.status(200).json({
      message: "Login successful",
      token,
    });
  } else {
    // Invalid credentials
    res.status(401).json({
      message: "Invalid email or password",
    });
  }
});

// Forgot password route
router.post("/forgot-password", async (req, res) => {
  try {
    // Email options
    const mailOptions = {
      from: '"HydrateHub" <hydratehub003@gmail.com>',
      to: "hydratehub003@gmail.com",
      subject: "Your HydrateHub Admin Credentials",
      text: `Here are your admin credentials:\n\nEmail: ${ADMIN_EMAIL}\nPassword: ${ADMIN_PASSWORD}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "An email with your credentials has been sent to your registered email.",
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).json({
      message: "Failed to send email. Please try again later.",
    });
  }
});

module.exports = router;
