import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import UserCard from "@/components/cards/userCard";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const res = await fetchUsers({
    userId: user.id,
    searchString: "", //searchParams.q,
    pageNumber: 1, //searchParams?.page ? +searchParams.page : 1 ,
    pageSize: 25,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
      <div className="mt-14 flex flex-col gap-9">
        {res.users.length === 0 ? (
          <p className="no-result">No Users</p>
        ) : (
          <>
            {res.users.map((user) => {
              return (
                <UserCard
                  key={user.id}
                  name={user.name}
                  username={user.username}
                  imgUrl={user.image}
                  id={user.id}
                  personType="User"
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
