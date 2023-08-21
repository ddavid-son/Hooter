import { fetchUserHoots } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";
import HootCard from "../cards/hootCard";
// import { IHoot } from "@/lib/models/hoot.model";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

export const HootsTab = async ({
  currentUserId,
  accountId,
  accountType,
}: Props) => {
  let res = await fetchUserHoots(accountId);

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
                    name: res.author.name,
                    image: res.author.image,
                    id: res.author.id,
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
};

export default HootsTab;
