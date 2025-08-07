"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import OAuth from "@/components/auth/oauth";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { baseUrl } from "../../../../config";
import useAuthStore from "@/store/user";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/components/layout/logo";

const formSchema = z.object({
  email: z.email({ error: "Valid email is required" }),
});

export default function SignupForm() {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/user/auth/signin`, values);
      setEmail(values.email);
      const { data } = res.data;
      setDevOtp(data.otp);
      setStep("otp");

      toast.success(`OTP sent! Check email. (OTP: ${devOtp})`);
    } catch (error) {
      console.error("Signin error:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          `Signin failed: ${error.response.data.message || "Please try again."}`
        );
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyOtp() {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${baseUrl}/user/auth/verify-otp`,
        {
          otp,
          email,
          action: "signin",
        },
        {
          withCredentials: true,
        }
      );

      const { data, token } = res.data;

      useAuthStore.getState().setCredentials(
        {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role || "CUSTOMER",
        },
        token
      );

      toast.success("Account verified! Redirecting...");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendOtp() {
    setIsLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/user/auth/resend-otp`, {
        email,
        action: "signin",
      });

      const { data } = res.data;

      setDevOtp(data.otp);

      toast.success("OTP sent to your mail");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "OTP sent failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-full">
      <div
        className="w-3/5 bg-cover bg-center hidden md:block"
        style={{ backgroundImage: "url(/img1.png)" }}
      />
      <div className="w-full md:w-2/5 flex items-center justify-center p-2 md:p-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <Logo />
            <CardTitle className="text-2xl font-bold">
              {step === "form" ? "Welcome Back 👋" : "Verify OTP"}
            </CardTitle>
            <CardDescription className="text-neutral-600">
              {step === "form"
                ? "Sign up to get services"
                : `Enter the OTP sent to ${email}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {step === "form" ? (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      size="lg"
                      type="submit"
                      className="w-full cursor-pointer"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending OTP..." : "Send OTP"}
                    </Button>
                  </form>
                </Form>
              ) : (
                <div className="space-y-6 w-full">
                  <div className="bg-muted p-4 rounded-md text-sm text-muted-foreground border">
                    <p>
                      <span className="font-medium">Email:</span> {email}
                    </p>
                    <p>
                      <span className="font-medium">OTP:</span>{" "}
                      <span className="text-primary font-semibold">
                        {devOtp || "Not received yet"}
                      </span>
                    </p>
                  </div>
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(val) => setOtp(val)}
                  >
                    <InputOTPGroup className="flex justify-center gap-3 w-full">
                      {[...Array(6)].map((_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="w-12 h-12 text-xl rounded-md border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  <Button
                    size="lg"
                    className="w-full cursor-pointer"
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Verify & Continue"}
                  </Button>
                  <p className="text-sm text-center">
                    Didn&apos;t receive the OTP?{" "}
                    <button
                      onClick={handleResendOtp}
                      className="text-primary underline font-medium cursor-pointer"
                    >
                      Resend
                    </button>
                  </p>
                </div>
              )}
            </motion.div>

            <OAuth />
            <CardDescription className="text-neutral-600 text-center mt-2 flex flex-col gap-4">
              <div>
                Don&apos;t have an account{"  "}
                <Link
                  href={"/signup"}
                  className="text-primary underline font-semibold"
                >
                  Sign Up
                </Link>
              </div>
              <div>
                <Link href="/admin/signin" className="text-black font-semibold">
                  Login as Admin
                </Link>
              </div>
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
