import { getDB } from "@/database";
import { customers } from "@/database/schema";
import {
  CreateCustomerResponseSchema,
  CreateCustomerSchema,
  DeleteCustomerResponseSchema,
  GetAllCustomersResponseSchema,
  GetCustomerByIdResponseSchema,
  UpdateCustomerResponseSchema,
  UpdateCustomerSchema
} from "@/lib/zod/customers.zod";
import { QueryParamsSchema } from "@/lib/zod/helpers";
import { and, desc, eq, sql } from "drizzle-orm";

// ================= Get all Customers Controller =================
export async function getAllCustomersController(
  query: QueryParamsSchema
): Promise<GetAllCustomersResponseSchema> {
  try {
    const db = getDB();
    const { limit, page, search, sort } = query;

    // Convert to numbers and validate
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
    const offset = (pageNum - 1) * limitNum;

    // Build where conditions
    const whereConditions = [];
    if (search) {
      whereConditions.push(
        sql`LOWER(${customers.name}) LIKE LOWER(${`%${search}%`})`
      );
    }

    // Build the query
    const customersQuery = db
      .select()
      .from(customers)
      .where(whereConditions.length ? and(...whereConditions) : undefined)
      .orderBy(
        sort.toLowerCase() === "asc"
          ? customers.createdAt
          : desc(customers.createdAt)
      )
      .limit(limitNum)
      .offset(offset);

    // Get total count for pagination metadata
    const totalCountQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(customers)
      .where(whereConditions.length ? and(...whereConditions) : undefined);

    const [customersEntries, _totalCount] = await Promise.all([
      customersQuery,
      totalCountQuery
    ]);

    const totalCount = _totalCount[0]?.count || 0;

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);

    return {
      data: {
        data: customersEntries,
        meta: {
          currentPage: pageNum,
          limit: limitNum,
          totalCount,
          totalPages
        }
      },
      success: true,
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error: (error as Error).message,
      success: false
    };
  }
}

// ================= Get customer by ID =================
export async function getCustomerByIdController(
  id: string
): Promise<GetCustomerByIdResponseSchema> {
  try {
    const db = getDB();

    const customer = await db.query.customers.findFirst({
      where: (fields, { eq }) => {
        return eq(fields.id, id);
      }
    });

    if (!customer) throw new Error("Customer not found");

    return {
      success: true,
      error: null,
      data: customer
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

// ================= Create new customer =================
export async function createNewCustomerController(
  payload: CreateCustomerSchema
): Promise<CreateCustomerResponseSchema> {
  try {
    const db = getDB();

    const [inserted] = await db
      .insert(customers)
      .values({
        name: payload.name,
        address: payload.address,
        currentBalance: payload.currentBalance,
        isActive: true,
        notes: payload.notes,
        phone: payload.phone,
        totalCreditLimit: payload.totalCreditLimit
      })
      .returning();

    return {
      data: inserted,
      success: true,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

// ================= Update customer =================
export async function updateCustomerController(
  id: string,
  payload: UpdateCustomerSchema
): Promise<UpdateCustomerResponseSchema> {
  try {
    const db = getDB();

    const [updated] = await db
      .update(customers)
      .set({ ...payload, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();

    if (!updated) throw new Error("Failed to update customer");

    return {
      data: updated,
      success: true,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

// ================= Delete customer =================
export async function deleteCustomerController(
  id: string
): Promise<DeleteCustomerResponseSchema> {
  try {
    const db = getDB();

    await db.delete(customers).where(eq(customers.id, id)).returning();

    return {
      data: { message: "Customer deleted successfully" },
      success: true,
      error: null
    };
  } catch (error) {
    const errorMessage = (error as Error).message;

    return {
      success: false,
      error: errorMessage
    };
  }
}
