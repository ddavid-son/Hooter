import * as z from "zod";

export const HootValidation = z.object({
  hoot: z.string().nonempty("Hoot can not be empty"),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  hoot: z.string().nonempty("Hoot(comment) can not be empty"),
});
