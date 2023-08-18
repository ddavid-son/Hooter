"use client";
import React from "react";
import { sidebarLinks } from "../../constants/index";
import Link from "next/link";
import Image from "next/Image";
import { useRouter, usePathname } from "next/navigation";
import { SignedIn, SignOutButton } from "@clerk/nextjs";
export const LeftSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isAactive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          return (
            <div className="">
              <Link
                href={link.route}
                key={link.label}
                className={`leftsidebar_link ${isAactive && "bg-primary-500"}`}
              >
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  width={24}
                  height={24}
                />
                <p className="text-light-1 max-lg:hidden">{link.label}</p>
              </Link>
            </div>
          );
        })}
      </div>
      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push("/sign-in")}>
            <div className="flex cursor-pointer p-4 gap-4">
              <Image
                alt="logout"
                width={24}
                height={24}
                src="/assets/logout.svg"
              />
              <p className="text-light-2 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSidebar;