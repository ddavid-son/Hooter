import Link from "next/link";
import Image from "next/Image";
import React from "react";
import { OrganizationSwitcher, SignedIn, SignOutButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
export const Topbar = () => {
  return (
    <nav className="topbar">
      <Link href="/" className="flex item-center gap-4">
        <Image width={28} height={28} src="/assets/logo.svg" alt="logo" />
        <p className="text-light-1 max-xs:hidden">Hooter</p>
      </Link>
      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image
                  alt="logout"
                  width={24}
                  height={24}
                  src="/assets/logout.svg"
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
          }}
        ></OrganizationSwitcher>
      </div>
    </nav>
  );
};

export default Topbar;
