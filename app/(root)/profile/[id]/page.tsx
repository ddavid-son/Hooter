import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { log } from "console";
import { profileTabs } from "@/constants";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import HootsTab from "@/components/shared/HootsTab";

interface Props {
  params: {
    id: string;
  };
}

async function Page({ params }: Props) {
  const user = await currentUser();
  log(params, "params");
  if (!user) return null;

  const userInfo = await fetchUser(params.id);

  console.log("is onboarded:", userInfo);

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

      <div className="mt-9">
        <Tabs defaultValue="hoots" className="w-full">
          <TabsList className="tab px-0 ">
            {profileTabs.map((tab) => {
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
                      {userInfo?.hoots?.length}
                    </p>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {profileTabs.map((tab) => {
            return (
              <TabsContent
                key={`content-${tab.label}`}
                value={tab.value}
                className="w-full text-light-1"
              >
                <HootsTab
                  currentUserId={user.id}
                  accountId={userInfo.id}
                  accountType="User"
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
