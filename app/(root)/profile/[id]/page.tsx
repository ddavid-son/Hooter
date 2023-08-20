import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";

interface Props {
  params: {
    id: string;
  };
}

async function Page(params: Props) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(params.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        author={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      ></ProfileHeader>
    </section>
  );
}

export default Page;
