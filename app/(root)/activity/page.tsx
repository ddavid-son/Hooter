import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser, getActivities } from "@/lib/actions/user.actions";

import Image from "next/image";
import Link from "next/link";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const activities = await getActivities(userInfo._id);

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {activities.length > 0 ? (
          <>
            {activities.map((activity) => {
              return (
                <Link key={activity._id} href={`/hoot/${activity.parentId}`}>
                  <article className=" activity-card">
                    <Image
                      src={activity.author.image}
                      alt={"profile picture"}
                      width={20}
                      height={20}
                      className=" rounded-full object-cover"
                    />
                    <p className=" !text-small-regular text-light-1">
                      <span className="mr-1 text-primary-500 ">
                        {activity.author.name}
                      </span>{" "}
                      replied to your hoot
                    </p>
                  </article>
                </Link>
              );
            })}
          </>
        ) : (
          <p className="!text-base-regular  text-light-3">No Activity Yet</p>
        )}
      </section>
    </section>
  );
}

export default Page;
