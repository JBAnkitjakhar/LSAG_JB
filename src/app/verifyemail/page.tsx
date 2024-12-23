  //src/app/verifyemail/page.tsx

  "use client";
  import { useState } from "react";
  import { useRouter } from "next/navigation";
  import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
  import { GlareCard } from "@/components/ui/glare-card";
  import { FlipWords } from "@/components/ui/flip-words";
  import { BackgroundGradient } from "@/components/ui/background-gradient";

  export default function VerifyEmailPage() {
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const words = ["DApp", "IIT-Bhilai", "Using LSAG", "Security"];

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const response = await fetch("/api/sendEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, type: "verification" }),
        });

        const data = await response.json();
        if (!response.ok) {
          setError(data.error);
          setLoading(false);
          return;
        }

        setSuccess(data.success);
        setError("");
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Failed to send verification code");
        setLoading(false);
      }
    };

    const handleVerify = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const response = await fetch("/api/sendEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, type: "verify", verificationCode }),
        });

        const data = await response.json();
        if (!response.ok) {
          setError(data.error);
          setLoading(false);
          return;
        }

        if (data.verified) {
          setSuccess(true);
          setLoading(false);
          router.push("/dashboard");
        } else {
          setError(data.message);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setError("Failed to verify code");
        setLoading(false);
      }
    };

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-8 sm:p-8">
        <div className="absolute inset-0">
          <GlareCard className="flex flex-col items-center justify-center    mt-4">
            <div className="flex flex-col items-center justify-start space-y-6 mb-auto pt-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500 text-transparent bg-clip-text">
                EVoting : <FlipWords words={words} />
              </h1>
            </div>
            <div className="flex flex-col items-center justify-end space-y-6 mt-auto pb-9 mb-5">
            <BackgroundGradient className="rounded-[14px] max-w-sm p-4 sm:p-4 pt-4 pr-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 via-purple-900 to-yellow-800 text-transparent bg-clip-text">
                Verify your Email
              </h1>
              </BackgroundGradient>
            </div>
          </GlareCard>
        </div>
        <div className="relative z-10 w-full max-w-[320px] sm:max-w-[380px] p-2 pt-8 mb-auto mt-14 pl-6 rounded-lg">
        

  {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 bg-gray-800/90 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none backdrop-blur-sm"
              />

              <HoverBorderGradient
                containerClassName="w-full rounded-full"
                as="button"
                className="w-full bg-black text-white py-2 flex items-center justify-center"
              >
                <span>{loading ? "Sending..." : "Send Verification Code"}</span>
              </HoverBorderGradient>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="verificationCode" className="block text-white">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  placeholder="Enter your Email"
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-gray-800/90 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none backdrop-blur-sm"
                />
              </div>

              <HoverBorderGradient
                containerClassName="w-full rounded-full"
                as="button"
                className="w-full bg-black text-white py-2 flex items-center justify-center"
              >
                <span>{loading ? "Verifying..." : "Verify"}</span>
              </HoverBorderGradient>
            </form>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
              {error}
            </div>
          )}
  
        </div>
      </div>
    );
  }

   