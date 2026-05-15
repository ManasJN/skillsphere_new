import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function VerifyOtp() {

  const navigate = useNavigate();

  const [otp, setOtp] = useState('');

  const email = localStorage.getItem('verifyEmail');
  console.log("Stored Email:", email);

  const handleVerify = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        'http://localhost:5000/api/auth/verify-otp',
        {
          email,
          otp
        }
      );

      alert('Email verified successfully');

      localStorage.setItem(
        'token',
        res.data.token
      );

      navigate('/dashboard');

    } catch (err) {

      alert(
        err.response?.data?.message ||
        'Verification failed'
      );

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <form
        onSubmit={handleVerify}
        className="bg-zinc-900 p-8 rounded-xl shadow-lg w-[350px]"
      >

        <h2 className="text-2xl font-bold mb-4">
          Verify OTP
        </h2>

        <p className="mb-4 text-gray-400">
          OTP sent to:
          <br />
          <b>{email}</b>
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value)
          }
          className="border border-zinc-700 bg-zinc-800 p-2 w-full mb-4 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 w-full rounded"
        >
          Verify
        </button>

      </form>

    </div>

  );
}