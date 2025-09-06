import { z } from "zod";
import {
  getBaseReturnSchema,
  getPaginatedSchema,
  messageSchema
} from "./helpers";

const baseCustomerSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  address: z.string(),
  totalCreditLimit: z.number(),
  currentBalance: z.number(),
  notes: z.string(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const selectCustomerSchema = baseCustomerSchema;

export type SelectCustomer = z.infer<typeof selectCustomerSchema>;

export const createCustomerSchema = selectCustomerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type CreateCustomerSchema = z.infer<typeof createCustomerSchema>;

export const updateCustomerSchema = createCustomerSchema.partial();

export type UpdateCustomerSchema = z.infer<typeof updateCustomerSchema>;

// Ent-to-end functionalities Return schemas/Types
export const getAllCustomersResponseSchema = getBaseReturnSchema(
  getPaginatedSchema(z.array(selectCustomerSchema))
);

export type GetAllCustomersResponseSchema = z.infer<
  typeof getAllCustomersResponseSchema
>;

export const getCustomerByIdResponseSchema =
  getBaseReturnSchema(selectCustomerSchema);

export type GetCustomerByIdResponseSchema = z.infer<
  typeof getCustomerByIdResponseSchema
>;

export const createCustomerResponseSchema =
  getBaseReturnSchema(selectCustomerSchema);

export type CreateCustomerResponseSchema = z.infer<
  typeof createCustomerResponseSchema
>;

export const updateCustomerResponseSchema =
  getBaseReturnSchema(selectCustomerSchema);

export type UpdateCustomerResponseSchema = z.infer<
  typeof updateCustomerResponseSchema
>;

export const deleteCustomerResponseSchema = getBaseReturnSchema(messageSchema);

export type DeleteCustomerResponseSchema = z.infer<
  typeof deleteCustomerResponseSchema
>;
