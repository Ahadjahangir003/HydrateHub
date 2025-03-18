const express = require('express');
const router = express.Router();
const Order = require('../models/OrderModel');
const nodemailer = require('nodemailer');

const emailConfig = {
  service: 'gmail',
  auth: {
    user: 'hydratehub003@gmail.com',
    pass: 'yewx scol ziom rlhr',
  },
};
const transporter = nodemailer.createTransport(emailConfig);

router.post('/order-detail', async (req, res) => {
  const { quantity, price, vendorId, userId, pId, vendor, user, p, type, userEmail, address, status } = req.body;

  try {
    const orderSaved = await Order.create({
      quantity: quantity ? quantity : null,
      price: quantity ? price * quantity : price,
      vendorId: vendorId,
      userId: userId,
      pId: pId,
      vendor: vendor,
      user: user,
      p: p,
      type: type,
      status: status,
      userEmail: userEmail,
    });
    if (type === 'Product') {
      const mailOptions = {
        from: '"HydrateHub" <hydratehub003@gmail.com>',
        to: userEmail,
        subject: 'Order Confirmation',
        text: `
              Dear ${user},
              
              Thank you for your order of ${p}! Here are the details:
              - Product ID: ${pId}
              - Quantity: ${quantity}
              - Payment: ${price * quantity} PKR
              - Your Address: ${address}
              - Vendor: ${vendor}
              - Status: ${status}
              
              Your Order Will be Delivered.
              
              Regards,
              HydrateHub
              `,
      };
      await transporter.sendMail(mailOptions);
    } else if (type === 'Package') {
      const mailOptions = {
        from: '"HydrateHub" <hydratehub003@gmail.com>',
        to: userEmail,
        subject: 'Package Confirmation',
        text: `
              Dear ${user},
              
              Thank you for booking ${p}! Here are the details:
              - Package ID: ${pId}
              - Payment: ${price} PKR
              - Your Address: ${address}
              - Vendor: ${vendor}
              - Status: ${status}
              
              We Will be in touch with you.
              
              Regards,
              HydrateHub
              `,
      };
      await transporter.sendMail(mailOptions);
    }
    res.status(201).json(orderSaved);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/all-orders', async (req, res) => {
  try {
    const allOrders = await Order.find();
    res.status(200).json(allOrders);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/vendor-orders/:vendorId', async (req, res) => {
  const { vendorId } = req.params;
  try {
    const vendorOrders = await Order.find({ vendorId });
    res.status(200).json(vendorOrders);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

router.patch('/status-update/:Id', async (req, res) => {
  const { Id } = req.params;
  try {
    const order = await Order.findById(Id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const mailOptions = {
      from: '"HydrateHub" <hydratehub003@gmail.com>',
      to: order.userEmail || 'hydratehub003@gmail.com',
      subject: 'Order Completion Confirmation',
      text: `
        Dear ${order.user},
        
        Your order for ${order.p} has been completed successfully! Here are the details:
        - Product/Package ID: ${order.pId}
        - Quantity: ${order.quantity || 'N/A'}
        - Payment: ${order.price} PKR
        - Vendor: ${order.vendor}
        - Status: Completed
        
        Thank you for shopping with us!
        
        Regards,
        HydrateHub
      `,
    };

    await transporter.sendMail(mailOptions);

    order.status = 'Completed';
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/user-orders/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const userOrders = await Order.find({ userId });
    res.status(200).json(userOrders);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
