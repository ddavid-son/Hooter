"use client";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { setInterval } from "timers/promises";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface Props {
  searchType: "search" | "communities";
}

function Searchbar({ searchType }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
  //   e.preventDefault();
  //   // here fetch data from backend
  //   router.push(
  //     `/${searchType}/${searchType === "search" ? `q=${searchQuery}` : ""}`
  //   );
  // }

  return (
    <div className="flex items-center gap-4 w-full">
      <div className="searchbar w-full">
        <Input
          className=" no-focus searchbar_input"
          id="text"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search For ${
            searchType === "communities" ? "communities" : "users"
          }...`}
        />
        <Image
          src="/assets/search-gray.svg"
          alt="search"
          width={24}
          height={24}
          className="object-contain"
        />
      </div>
      <Button
        // onClick={(e) => {
        //   handleSubmit(e);
        // }}
        className=" h-full py-4"
      >
        Search
      </Button>
    </div>
  );
}

export default Searchbar;
