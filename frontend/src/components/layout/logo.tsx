import Image from "next/image";
import Link from "next/link";
import React from "react";

function Logo() {
  return (
    <Link href="/" className="flex items-center justify-center">
      <Image
        src="/logo.png"
        alt="sms"
        width={300}
        height={100}
        className="w-[100px]"
      />
    </Link>
  );
}

export default Logo;
