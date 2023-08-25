"use server";

import { revalidatePath } from "next/cache";
import Hoot from "../models/hoot.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { log } from "console";
import Community from "../models/community.model";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createHoot({ text, author, communityId, path }: Params) {
  connectToDB();

  try {
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    // const u = new Hoot({});
    const createdHoot = await Hoot.create({
      text,
      author,
      community: communityIdObject,
      likes: {},
    });

    await User.findByIdAndUpdate(author, {
      $push: { hoots: createdHoot._id },
    });

    if (communityIdObject) {
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { hoots: createdHoot._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`could not create Hoot: ${error.message}`);
  }
}

export async function fetchHoots(pageNumber = 1, pageSize = 20) {
  connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;

  try {
    // this will give posts and not comments - no await here, exec query will be done later
    const hootsQuery = Hoot.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "community",
        model: Community,
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });

    const totalHootsCount = await Hoot.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const hoots = await hootsQuery.exec();
    const isNext = totalHootsCount > skipAmount + hoots.length;

    return { hoots, isNext };
  } catch (error: any) {
    throw new Error(`could not get hoots: ${error.message}`);
  }
}

export async function fetchHootById(id: string) {
  //hoot id
  connectToDB();

  try {
    const hoot = await Hoot.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Hoot,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return hoot;
  } catch (error: any) {
    throw new Error(`failed fetcing hoot by id. error:${error.message}`);
  }
}

export async function addCommentToHoot(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();
  try {
    const originalHoot = await Hoot.findById(threadId);

    if (!originalHoot) throw new Error(`Hoot not found`);

    const commentHoot = new Hoot({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    const savedCommentThread = await commentHoot.save();

    originalHoot.children.push(savedCommentThread._id);
    await originalHoot.save();
    revalidatePath(path); // need to see if this method of 'updating the parent component is good '
  } catch (error: any) {
    throw new Error(`Error adding comment to thread: ${error.message}`);
  }
}

export async function likeHoot(hootId: string, userId: string, path: string) {
  try {
    connectToDB();

    const user = await User.findById(userId);
    const hoot = await Hoot.findById(hootId);

    if (user.likes.has(hootId)) {
      user.likes.delete(hootId);
      hoot.likes.delete(userId);
    } else {
      user.likes.set(hootId, hootId);
      hoot.likes.set(userId, userId);
    }

    // user.markModified("likes");
    // hoot.markModified("likes");
    user.save();
    hoot.save();

    // revalidatePath(path);
  } catch (error: any) {
    throw new Error(`failed liking the hoot error: ${error}`);
  }
}

//

async function fetchAllChildHoots(hootId: string): Promise<any[]> {
  const childHoots = await Hoot.find({ parentId: hootId });

  const descendantHoots = [];
  for (const childHoot of childHoots) {
    const descendants = await fetchAllChildHoots(childHoot._id);
    descendantHoots.push(childHoot, ...descendants);
  }

  return descendantHoots;
}

export async function deleteHoot(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    const mainHoot = await Hoot.findById(id).populate("author community");

    if (!mainHoot) {
      throw new Error("Hoot not found");
    }

    const descendantHoots = await fetchAllChildHoots(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantHootIds = [id, ...descendantHoots.map((hoot) => hoot._id)];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantHoots.map((hoot) => hoot.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainHoot.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantHoots.map((hoot) => hoot.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainHoot.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Hoot.deleteMany({ _id: { $in: descendantHootIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { hoots: { $in: descendantHootIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { hoots: { $in: descendantHootIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete hoot: ${error.message}`);
  }
}
