"use client";

import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { CommentValidation } from "@/lib/validations/hoot";
import { addCommentToHoot } from "@/lib/actions/hoot.actions";
// import { addCommentToThread } from "@/lib/actions/thread.actions";

interface Props {
  hootId: string;
  currentUserImg: string;
  currentUserId: string;
}

function Comment({ hootId, currentUserImg, currentUserId }: Props) {
  const pathname = usePathname();
  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      hoot: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToHoot(
      hootId,
      values.hoot,
      currentUserId.toString(),
      pathname
    );

    form.reset();
  };
  return (
    <Form {...form}>
      <form className="comment-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="hoot"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel className="h-12 min-w-12 ">
                <Image
                  src={currentUserImg}
                  alt="current user image"
                  width={48}
                  height={48}
                  className="rounded-full object-cover h-12 min-w-[48px]"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  {...field}
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
}

export default Comment;
