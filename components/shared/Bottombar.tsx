"use client";
import { sidebarLinks } from "@/constants";
import Link from "next/link";
import Image from "next/Image";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

export const Bottombar = () => {
  // const router = useRouter();
  const pathname = usePathname();

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link) => {
          const isAactive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          return (
            <div className="">
              <Link
                href={link.route}
                key={link.label}
                className={`bottombar_link ${isAactive && "bg-primary-500"}`}
              >
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  width={24}
                  height={24}
                />
                <p className="text-subtle-medium text-light-1 max-sm:hidden">
                  {link.label.split(" ")[0]}
                </p>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Bottombar;
