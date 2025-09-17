import React from "react";
import SigninForm from "@/components/auth/signin-form";

export default async function SigninPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const sp = await searchParams;
  const raw = sp?.redirect;
  const redirect = typeof raw === "string" && raw.length > 0 ? raw : "/";

  return <SigninForm initialRedirect={redirect} />;
}
