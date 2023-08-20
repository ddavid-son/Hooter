import React from "react";

interface Props {
  accountId: string;
  author: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
}

export const ProfileHeader = ({
  accountId,
  author,
  name,
  username,
  imgUrl,
  bio,
}: Props) => {
  return <div>ProfileHeader</div>;
};

export default ProfileHeader;
