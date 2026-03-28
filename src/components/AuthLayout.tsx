import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side (Brand / Image) */}
      <div className="hidden md:flex items-center justify-center bg-primary text-white">
        <div className="text-center px-10">
          <h1 className="text-4xl font-bold mb-4">Chat App 💬</h1>
          <p className="text-lg opacity-80">
            Connect with your friends in real-time
          </p>
        </div>
      </div>

      {/* Right Side (Form) */}
      <div className="flex items-center justify-center bg-white">
        <div className="w-full max-w-md px-6">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
