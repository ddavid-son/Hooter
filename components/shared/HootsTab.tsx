import { fetchUserHoots } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";
import HootCard from "../cards/hootCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import { log } from "console";
// import { IHoot } from "@/lib/models/hoot.model";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

async function HootsTab({ currentUserId, accountId, accountType }: Props) {
  let res =
    accountType === "Community"
      ? await fetchCommunityPosts(accountId)
      : await fetchUserHoots(accountId);

  if (!res) redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {res.hoots.map((hoot: any) => {
        // todo: get rid of the any
        return (
          <HootCard
            key={hoot._id}
            id={hoot._id}
            currentUserId={currentUserId}
            parentId={hoot?.parentId}
            content={hoot.text}
            author={
              accountType === "User"
                ? { name: res.name, image: res.image, id: res.id }
                : {
                    name: hoot.author.name,
                    image: hoot.author.image,
                    id: hoot.author.id,
                  }
            }
            community={hoot.commuinity}
            createdAt={hoot.creaatedAt}
            comments={hoot.children}
          />
        );
      })}
    </section>
  );
}

export default HootsTab;
