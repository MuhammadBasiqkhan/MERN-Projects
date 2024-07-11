// Load environment variables
require('dotenv').config();

// Import required modules

const AsyncError = require('../middleware/Catchasyncerrors');

// Payment processing function
const processPayment = AsyncError(async (req, res, next) => {
  
  const { paymentAmount, customerName, customerEmail, shippingAddress } = req.body;



  if (!paymentAmount) {
    console.error('Payment amount not found in request body!');
    return res.status(400).json({ success: false, message: 'Missing payment amount' });
  }

  console.log('Received payment data:', req.body);

  res.status(200).json({ success: true, message: "Payment Succesfully done" });
});

// // Function to send Stripe API key
// const sendStripeApiKey = AsyncError(async (req, res, next) => {
//   res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
// });

// Export the functions
module.exports = {
  processPayment,
 
};
