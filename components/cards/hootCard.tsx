import Link from "next/link";
import Image from "next/image";
import { classNames } from "uploadthing/client";
import { formatDateString } from "@/lib/utils";
import { log } from "console";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

function HootCard({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: Props) {
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className=" flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className=" flex items-center flex-col">
            <Link
              className=" relative h-11 w-11"
              href={`/profile/${author.id}`}
            >
              <Image
                src={author.image}
                alt="profile image"
                fill={true}
                sizes="5vw"
                className=" cursor-pointer rounded-full"
              />
            </Link>

            <div className=" thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <Link className=" w-fit" href={`/profile/${author.id}`}>
              <h4 className=" cursor-pointer text-base-semibold  text-light-1 ">
                {author.name}
              </h4>
            </Link>
            <p className=" mt-2 text-small-regular text-light-2">{content}</p>
            <div
              className={` ${isComment && "mb-10"} mt-5 flex flex-col gap-3`}
            >
              <div className="flex gap-3.5">
                <Image
                  src={"/assets/heart-gray.svg"}
                  alt="like button"
                  width={24}
                  height={24}
                  className=" cursor-pointer  object-contain"
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
              {isComment && comments.length > 0 && (
                <Link href={`/hoots/${id}`}></Link>
              )}
            </div>
          </div>
        </div>
      </div>
      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className="mt-5 flex items-center"
        >
          <p className=" text-subtle-medium text-gray-1">
            {formatDateString(createdAt)} - {community.name} Community
          </p>
          <Image
            src={community.image}
            width={14}
            height={14}
            alt={community.name}
            className=" ml-1 rounded-full object-cover"
          />
        </Link>
      )}
    </article>
  );
}

export default HootCard;
