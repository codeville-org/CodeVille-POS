import { z } from "zod";
import { getBaseReturnSchema } from "./helpers";

// Key-Value Mapper for App Settings
export const securitySchema = z.object({
  // Security Settings
  message: z.string().optional()
});

// End-to-end Schema
export const securityResponseSchema = getBaseReturnSchema(securitySchema);

export type GetSecurityResponseT = z.infer<typeof securityResponseSchema>;
