import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Verification = () => {
  const [pin, setPin] = useState(new Array(6).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Handle pin input
  const handleChange = (value, index) => {
    const updatedPin = [...pin];
    if (value.match(/^[0-9]$/)) {
      updatedPin[index] = value; // Only allow single digit
      setPin(updatedPin);

      // Focus on the next input box
      if (index < 5) {
        document.getElementById(`pin-${index + 1}`).focus();
      }
    } else if (value === '') {
      updatedPin[index] = ''; // Allow clearing the input
      setPin(updatedPin);
    }
  };

  // Handle backspace to move focus to the previous box
  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace' && pin[index] === '' && index > 0) {
      document.getElementById(`pin-${index - 1}`).focus();
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const verificationCode = pin.join(''); // Combine pin array into a single string

    if (verificationCode.length !== 6) {
      toast.error('Please enter all 6 digits of the pin.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/user/verify-pin', {
        pin: verificationCode,
        email: localStorage.getItem('vemail')
      });

      if (response.status === 200) {

        toast.success('Verification successful!', {
          onClose: () => {
        const purpose=localStorage.getItem('vpurpose');
        console.log(purpose);
        if(purpose==='Signup'){
               localStorage.removeItem('vemail');
               navigate('/login')
              }
              else{
               navigate('/reset-password'); // Navigate to reset password page
              }
          },
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      const errorMessage = error.response?.data?.message || 'Invalid pin. Please try again.';
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div id="login-container" className="min-h-screen z-0 flex flex-col justify-center items-center">
      <div id="verification-box" className="w-96 z-10 bg-gray-200 p-8 shadow-md rounded">
        <ToastContainer /> {/* Toast notifications */}
        <div id="verification-logo" className="flex justify-center mb-4">
          <Link to="/">
            <img src={'assets/logo.png'} alt="Logo" className="h-12" />
          </Link>
        </div>
        <h1 id="verification-title" className="text-2xl font-semibold text-center mb-6">Verify Pin</h1>
        <p className="text-center text-gray-600 mb-6">
          Enter the 6-digit verification pin sent to your email.
        </p>
        <form id="verification-form" onSubmit={handleSubmit}>
          <div id="pin-inputs" className="flex justify-center gap-2 mb-4">
            {pin.map((digit, index) => (
              <input
                key={index}
                id={`pin-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
              />
            ))}
          </div>
          <button
            type="submit"
            className={`w-full py-2 mt-4 text-white rounded ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verifying...' : 'Verify Pin'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Resend Pin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Verification;
