import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleSignUp = async () => {
    navigate("/signup");
  };
  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-6 text-center">Create an account</h2>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Full Name"
          className="border rounded-xl px-4 py-2 focus:outline-primary"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="border rounded-xl px-4 py-2 focus:outline-primary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="bg-primary text-white py-2 rounded-xl hover:bg-primaryDark"
          onClick={() => {
            navigate("/otp");
          }}
        >
          Send OTP
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <span
            className="text-primary cursor-pointer"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;
