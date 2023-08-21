"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Hoot from "../models/hoot.model";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  connectToDB();
  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        image,
        bio,
        path,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`faled to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId });
    // .populate({
    //   path: "communities",
    //   model: Community,
    // });
  } catch (error: any) {
    throw new Error(`could not fetch user from mongo: ${error.message}`);
  }
}

export async function fetchUserHoots(userId: string) {
  connectToDB();

  try {
    // const hoots = await User.findOne({ id: userId }).populate({
    //   path: "hoots",
    //   model: Hoot,
    //   populate: {
    //     path: "children",
    //     model: Hoot,
    //     populate: {
    //       path: "author",
    //       model: User,
    //       select: "name image id",
    //     },
    //   },
    // });

    const hoots = await User.findOne({ id: userId }).populate({
      path: "hoots",
      model: Hoot,
      populate: [
        // {
        //   path: "community",
        //   model: Community,
        //   select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
        // },
        {
          path: "children",
          model: Hoot,
          populate: {
            path: "author",
            // model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    });

    return hoots;
  } catch (error: any) {
    throw new Error(`error fetching users Hoots, error: ${error.message}`);
  }
}
