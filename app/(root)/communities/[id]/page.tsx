import { currentUser } from "@clerk/nextjs";

import ProfileHeader from "@/components/shared/ProfileHeader";
import { communityTabs } from "@/constants";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import HootsTab from "@/components/shared/HootsTab";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import UserCard from "@/components/cards/userCard";

interface Props {
  params: {
    id: string;
  };
}

async function Page({ params }: Props) {
  const user = await currentUser();
  if (!user) return null;

  const communittDetails = await fetchCommunityDetails(params.id);

  return (
    <section>
      <ProfileHeader
        accountId={communittDetails.id}
        author={user.id}
        name={communittDetails.name}
        username={communittDetails.username}
        imgUrl={communittDetails.image}
        bio={communittDetails.bio}
        type="Community"
      ></ProfileHeader>

      <div className="mt-9">
        <Tabs defaultValue="hoots" className="w-full">
          <TabsList className="tab px-0 ">
            {communityTabs.map((tab) => {
              return (
                <TabsTrigger className="tab" key={tab.label} value={tab.value}>
                  <Image
                    src={tab.icon}
                    alt={tab.label}
                    height={24}
                    width={24}
                    className="object-contain"
                  />
                  <p className=" max-sm:hidden">{tab.label}</p>
                  {tab.label === "Hoots" && (
                    <p className="ml-1 rounded-full bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                      {communittDetails?.hoots?.length}
                    </p>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="hoots" className="w-full text-light-1">
            <HootsTab
              currentUserId={user.id}
              accountId={communittDetails.id}
              accountType="Community"
            />
          </TabsContent>

          <TabsContent value="members" className="w-full text-light-1">
            <section className="mt-9 flex flex-col gap-10">
              {communittDetails.members.map((member: any) => (
                <UserCard
                  key={member.id}
                  name={member.name}
                  username={member.username}
                  imgUrl={member.image}
                  id={member.id}
                  personType={"User"}
                />
              ))}
            </section>
          </TabsContent>

          <TabsContent value="requests" className="w-full text-light-1">
            <HootsTab
              currentUserId={user.id}
              accountId={communittDetails.id}
              accountType="Community"
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
