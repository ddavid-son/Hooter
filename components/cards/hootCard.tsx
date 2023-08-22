import Link from "next/link";
import Image from "next/image";

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
    </article>
  );
}

export default HootCard;
