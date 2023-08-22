import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import UserCard from "@/components/cards/userCard";
import { fetchCommunities } from "@/lib/actions/community.actions";
import CommunityCard from "@/components/cards/communityCard";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const res = await fetchCommunities({
    searchString: "", //searchParams.q,
    pageNumber: 1, //searchParams?.page ? +searchParams.page : 1 ,
    pageSize: 25,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
      <div className="mt-14 flex flex-col gap-9">
        {res.communities.length === 0 ? (
          <p className="no-result">No communities</p>
        ) : (
          <>
            {res.communities.map((community) => {
              return (
                <CommunityCard
                  key={community.id}
                  name={community.name}
                  username={community.username}
                  imgUrl={community.image}
                  id={community.id}
                  members={community.members}
                  bio={community.bio}
                />
              );
            })}
          </>
        )}
      </div>
    </section>
  );
}

export default Page;
