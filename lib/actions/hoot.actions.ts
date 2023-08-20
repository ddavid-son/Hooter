"use server";

import { revalidatePath } from "next/cache";
import Hoot, { IHoot } from "../models/hoot.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createHoot({ text, author, communityId, path }: Params) {
  connectToDB();

  try {
    const createdHoot = await Hoot.create({
      text,
      author,
      community: null,
    });

    await User.findByIdAndUpdate(author, {
      $push: { hoot: createdHoot._id },
    });

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
        path: "children",
        model: User,
        select: "_id name parentId image",
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
  connectToDB();

  try {
    const hoot = await Hoot.findById(id)
      .populate({
        path: "author",
        model: User,
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
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment to thread: ${error.message}`);
  }
}
