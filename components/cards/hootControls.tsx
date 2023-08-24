"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { likeHoot } from "@/lib/actions/hoot.actions";
import { boolean } from "zod";
import { useEffect, useState } from "react";

interface Props {
  id: string;
  userId: string;
  isLiked: boolean;
}

const HootControls = ({ id, userId, isLiked }: Props) => {
  const pathname = usePathname();
  // const [isLikedState, setisLiked] = useState<boolean>(isLiked);
  useEffect(() => {}, [isLiked]);

  function handleLike() {
    // like using action
    likeHoot(id, userId, pathname);
    // revalidate in the action or just change in ui(basically bad idea?)
    // change ui
  }
  return (
    <div className="flex gap-3.5">
      <Image
        onClick={() => handleLike()}
        src={"/assets/heart-gray.svg"}
        alt="like button"
        width={24}
        height={24}
        className=" cursor-pointer  fill-red-600  object-contain"
      />
      <Link href={`/hoot/${id}`}>
        <Image
          src={"/assets/reply.svg"}
          alt="reply button"
          width={24}
          height={24}
          className=" cursor-pointer  object-contain"
        />
      </Link>
      <Image
        src={"/assets/repost.svg"}
        alt="repost button"
        width={24}
        height={24}
        className=" cursor-pointer  object-contain"
      />
      <Image
        src={"/assets/share.svg"}
        alt="share button"
        width={24}
        height={24}
        className=" cursor-pointer  object-contain"
      />
    </div>
  );
};

export default HootControls;
