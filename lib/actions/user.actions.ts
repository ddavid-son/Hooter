"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Hoot from "../models/hoot.model";
import { FilterQuery, SortOrder } from "mongoose";
import Community from "../models/community.model";

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

    return await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    });
  } catch (error: any) {
    throw new Error(`could not fetch user from mongo: ${error.message}`);
  }
}

export async function fetchUserHoots(userId: string) {
  connectToDB();

  try {
    const hoots = await User.findOne({ id: userId }).populate({
      path: "hoots",
      model: Hoot,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id",
        },
        {
          path: "children",
          model: Hoot,
          populate: {
            path: "author",
            model: User,
            select: "name image id",
          },
        },
      ],
    });

    return hoots;
  } catch (error: any) {
    throw new Error(`error fetching users Hoots, error: ${error.message}`);
  }
}

interface fetchUsersProps {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: "asc" | "desc"; //string;
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: fetchUsersProps) {
  try {
    connectToDB();
    const skipAmount = (pageNumber - 1) * pageSize;
    const regx = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // ne == not equal
    };

    if (searchString.trim() !== "") {
      query.$or = [{ username: { $regex: regx } }, { name: { $regx: regx } }];
    }

    const sortOptions: { [key: string]: SortOrder } = {
      createdAt: sortBy,
    };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const usersCount = await User.countDocuments(query);
    const users = await usersQuery.exec();

    const isNext = usersCount > skipAmount + users.length;
    return { users, isNext };
  } catch (error: any) {
    throw new Error(`could not fetch users. error: ${error.message}`);
  }
}

export async function getActivities(userId: string) {
  try {
    connectToDB();
    const userHoots = await Hoot.find({ author: userId });

    const childHootIds = userHoots.reduce((acc, userHoot) => {
      return acc.concat(userHoot.children);
    }, []);

    const replies = await Hoot.find({
      _id: { $in: childHootIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error: any) {
    throw new Error(`could not fetch activities. error: ${error.message}`);
  }
}
