import HootCard from "@/components/cards/hootCard";
import { fetchHoots } from "@/lib/actions/hoot.actions";
import User from "@/lib/models/user.model";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const res = await fetchHoots(1, 30);
  const user = await currentUser();

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {res.hoots.length === 0 ? (
          <p className="no-result">No Hoots found</p>
        ) : (
          <>
            {res.hoots.map((hoot) => {
              return (
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
              );
            })}
          </>
        )}
      </section>
    </>
  );
}
