import HootCard from "@/components/cards/hootCard";
import { fetchHootById } from "@/lib/actions/hoot.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import Comment from "@/components/forms/Comment";

export const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const hoot = await fetchHootById(params.id);

  return (
    <section className="relative">
      <div className="">
        <HootCard
          key={hoot._id}
          id={hoot._id}
          currentUserId={user?.id || ""}
          parentId={hoot?.parentId}
          content={hoot.text}
          author={hoot.author}
          community={hoot.commuinity}
          createdAt={hoot.creaatedAt}
          comments={hoot.children}
        />
      </div>

      <div className="mt-7">
        <Comment
          hootId={hoot.id}
          currentUserId={userInfo?._id.toString()}
          currentUserImg={userInfo.image}
        />
      </div>
      <div className="mt-10">
        {hoot.children.map((child: any) => {
          return (
            <HootCard
              key={child._id}
              id={child._id}
              currentUserId={user?.id || ""}
              parentId={child?.parentId}
              content={child.text}
              author={child.author}
              community={child.commuinity}
              createdAt={child.creaatedAt}
              comments={child.children}
              isComment={true}
            />
          );
        })}
      </div>
    </section>
  );
};
export default Page;
