import { z } from "zod";


export const taskSchema = () => {
  return z.object({
    // taskId: z.string().min(1, "Task ID is required"),
    name: z.string().min(1, "Task name is required"),
    detailsUrl: z.string().min(1, "Task details URL is required"),
    owner: z.string().min(1, "Task owner is required"),
    entityAddress: z.string()
      .min(1, "Entity address is required"),
    expiryDate: z.date({ required_error: "Expiry date is required" }),
    rewardToken: z.string()
      .min(1, "Reward token address is required")
      .default(process.env.NEXT_PUBLIC_RAHAT_TOKEN || ""),
    totalRewardAmount: z.coerce
      .string({
        required_error: "Reward amount is required",
        invalid_type_error: "Reward amount must be a number",
      })
      .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Reward amount must be a positive number"
      }),
    isOpen: z.boolean().default(true),
    isTokenDisbursed: z.boolean().default(false),
    acceptedParticipantCount: z.number(). optional().default(0),
    verifiedParticipants: z.array(z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid Ethereum address")).optional().default([]),
    requireApproval: z.boolean().default(true),
    isWhitelisted: z.boolean().default(true),
    maxParticipants: z.number()
      .int()
      .positive()
      .min(1, "At least one participant must be allowed"),
    whitelistedParticipants: z.array(z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid Ethereum address"))
      .optional()
      .default([])
  });
};

// Type for the form data that will be validated by the schema
export type TaskFormData = z.infer<ReturnType<typeof taskSchema>>;

