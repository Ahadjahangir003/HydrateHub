import { yupResolver } from "@hookform/resolvers/yup";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import * as yup from "yup";

const Cart = ({ data, deleteFromCart, orderCompleted }) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  // Form validation schema
  const schema = yup.object().shape({
    phone: yup
      .string()
      .matches(/^[0-9]{11}$/, "Phone number must be 11 digits")
      .required("Phone is required"),
    address: yup.string().required("Address is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const totalAmount = data?.reduce((acc, cart) => {
    const quantity = cart.quantity || 1; // Default quantity to 1 if not present
    return acc + cart.price * quantity;
  }, 0);

  const handleCheckout = async (formData) => {
    if (!stripe || !elements) {
      toast.error("Stripe is not loaded yet.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      toast.error(error.message);
      return;
    }
    
    try {
    {data.forEach((cartData) => {
        
        const checkoutData = {
            pId:cartData.pId,
            userId:cartData.userId,
            vendorId:cartData.vendorId,
            p:cartData.p,
            vendor:cartData.vendor,
            user:cartData.user,
            price:cartData.price,
            quantity:cartData.quantity,
            type:cartData.type,
            userEmail:cartData.userEmail,
            address: formData.address,
            status: cartData.status,
        };
        
        const response =  axios.post("http://localhost:3001/order/order-detail", checkoutData);
        console.log(response);
    });}
        orderCompleted();
        toast.success("Payment successful!");
        setShowCheckout(false);
        reset(); // Reset the form
    } catch (err) {
      toast.error("An error occurred during payment.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b flex flex-col items-center from-blue-500 to-teal-500 rounded-md p-4">
      <div className="w-5/6 mb-2 flex flex-col items-center md:flex-row gap-2">
        <button
          disabled={data?.length === 0}
          className="w-5/6 md:w-3/6 rounded-full bg-white text-blue-600 text-center py-2 cursor-pointer hover:scale-95 duration-300"
          onClick={() => setShowCheckout(true)}
        >
          Checkout
        </button>
        <div className="w-5/6 md:w-3/6 rounded-full bg-white text-blue-600 text-center py-2">
          Total Amount: <b>{totalAmount}Rs</b>
        </div>
      </div>

      {data?.map((cart, index) => (
        <div
          key={index}
          className="w-11/12 rounded-lg gap-2 flex mb-2 flex-row bg-gray-300 py-2 pr-8 pl-2"
        >
          <img
            className="w-28"
            src={
              cart.image
                ? `http://localhost:3001/uploads/${cart.image}`
                : "/assets/DefaultCompany.png"
            }
            alt={cart.p}
          />
          <div>
            <h1>
              Title: <b>{cart.p}</b>
            </h1>
            <h1>
              Price per Product: <b>{cart.price}Rs</b>
            </h1>
            <h1>
              Vendor: <b>{cart.vendor}</b>
            </h1>
            {cart.quantity && (
              <h1>
                Quantity: <b>{cart.quantity}</b>
              </h1>
            )}
          </div>
          <div className="fixed right-12 md:right-16 duration-300 hover:scale-125 cursor-pointer">
            <FaTimes onClick={() => deleteFromCart(data, index)} />
          </div>
        </div>
      ))}

      {showCheckout && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Checkout</h2>
              <FaTimes
                className="cursor-pointer"
                onClick={() => setShowCheckout(false)}
              />
            </div>
            <form onSubmit={handleSubmit(handleCheckout)} className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">User Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      className="w-full p-2 border rounded"
                      placeholder="Phone"
                      {...register("phone")}
                    />
                    <p className="text-red-500 text-sm">{errors.phone?.message}</p>
                  </div>
                  <div>
                    <input
                      className="w-full p-2 border rounded"
                      placeholder="Address"
                      {...register("address")}
                    />
                    <p className="text-red-500 text-sm">{errors.address?.message}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">Card Details</h3>
                <div className="border p-2 rounded">
                  <CardElement />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
