import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { useNavigate } from "react-router-dom";
const Otp = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };
  const navigate = useNavigate();
  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-4 text-center">Verify OTP</h2>

      <p className="text-center text-sm mb-6">
        Enter the 6-digit code sent to your email
      </p>

      <div className="flex justify-between gap-2 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            className="w-12 h-12 text-center border rounded-xl focus:outline-primary"
          />
        ))}
      </div>

      <button
        className="w-full bg-primary text-white py-2 rounded-xl"
        onClick={() => {navigate("/dashboard");}}
      >
        Verify
      </button>
    </AuthLayout>
  );
};

export default Otp;
