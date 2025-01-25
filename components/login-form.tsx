'use client';
import { useState } from "react";
import { useRouter } from 'next/navigation'; // For Next.js 13 and above
// import { useRouter } from 'next/router'; // For Next.js 12 and below
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/lib/client";
import { Alert, AlertDescription } from "./ui/alert";
import { checkEmailExists } from "@/utils/checkEmailExists";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showOtpField, setShowOtpField] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const router = useRouter(); // Initialize useRouter

  // Handle login with email and password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Step 1: Verify email and password
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      // Step 2: Send OTP after successful password verification
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // Prevent creating new users
        },
      });

      if (otpError) throw otpError;

      // Show OTP field and inform the user
      setShowOtpField(true);
      setSuccess("សូមបញ្ចូលលេខកូដ OTP ដែលបានផ្ញើទៅអ៊ីមែលរបស់អ្នក។");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("មានកំហុសមិនបានរំពឹងទុកកើតឡើង។");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleOtpVerification = async () => {
    if (!email || !otp) {
      setError("សូមបញ្ចូលអ៊ីមែល និងលេខកូដ OTP របស់អ្នក។");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Verify the OTP code
      const { error: otpError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email", // Use "email" for OTP codes
      });

      if (otpError) throw otpError;

      // Mark OTP as verified
      setIsOtpVerified(true);
      setSuccess("ចូលប្រើប្រាស់ជោគជ័យ!");

      // Redirect to the home page after a short delay
      setTimeout(() => {
        router.push("/"); // Redirect to the home page
      }, 2000); // 2 seconds delay
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("មានកំហុសមិនបានរំពឹងទុកកើតឡើង។");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (googleError) throw googleError;

      setShowOtpField(true);
      setSuccess("សូមបញ្ចូលលេខកូដ OTP ដែលបានផ្ញើទៅអ៊ីមែលរបស់អ្នក។");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("មានកំហុសមិនបានរំពឹងទុកកើតឡើង។");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handleResetPassword = async () => {
    if (!email) {
      setError("សូមបញ្ចូលអ៊ីមែលរបស់អ្នកដើម្បីកំណត់ពាក្យសម្ងាត់ឡើងវិញ។");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Check if the email exists
      const emailExists = await checkEmailExists(email);

      if (!emailExists) {
        throw new Error("អ៊ីមែលនេះមិនត្រូវបានចុះឈ្មោះ។");
      }

      // Send the password reset email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/reset-password',
      });

      if (resetError) throw resetError;

      setSuccess("អ៊ីមែលកំណត់ពាក្យសម្ងាត់ឡើងវិញត្រូវបានផ្ញើ។ សូមពិនិត្យក្នុងប្រអប់សាររបស់អ្នក។");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("មានកំហុសមិនបានរំពឹងទុកកើតឡើង។");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">សូមស្វាគមន៍មកកាន់ប្រព័ន្ធរបស់យើង</CardTitle>
          <CardDescription>ចូលប្រើប្រាស់ដោយគណនី Google របស់អ្នក</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                  disabled={loading || isOtpVerified}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  ចូលប្រើប្រាស់ដោយ Google
                </Button>
              </div>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  ឬបន្តការចូលប្រើដោយ
                </span>
              </div>

              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">អ៊ីមែល</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email" 
                  />
                </div>

                {!showOtpField && (
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">ពាក្យសម្ងាត់</Label>
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                        onClick={handleResetPassword}
                      >
                        ភ្លេចពាក្យសម្ងាត់របស់អ្នក?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password" 
                    />
                  </div>
                )}

                {showOtpField && (
                  <div className="grid gap-2">
                    <Label htmlFor="otp">លេខកូដ OTP</Label>
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                    >
                      <InputOTPGroup>
                        {[...Array(6)].map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Success Message */}
                {success && (
                  <Alert variant="default">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || isOtpVerified}
                  onClick={showOtpField ? handleOtpVerification : undefined}
                >
                  {loading ? "កំពុងចូលប្រើប្រាស់..." : isOtpVerified ? "ចូលប្រើប្រាស់ជោគជ័យ" : "ចូលប្រើប្រាស់"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}