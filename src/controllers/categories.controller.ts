import { getDB } from "@/database";
import { categories } from "@/database/schema";
import {
  CreateCategoryResponse,
  DeleteCategoryResponse,
  GetAllCategoriesResponse,
  GetCategoryByIDResponse,
  InsertCategorySchema,
  UpdateCategoryResponse,
  UpdateCategorySchema
} from "@/lib/zod/categories.zod";
import { QueryParamsSchema } from "@/lib/zod/helpers";
import { and, desc, eq, sql } from "drizzle-orm";

// ================= Get all Categories Controller =================
export async function getAllCategoriesController(
  query: QueryParamsSchema
): Promise<GetAllCategoriesResponse> {
  try {
    const db = getDB();
    const { search, page, limit, sort } = query;

    // Convert to numbers and validate
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
    const offset = (pageNum - 1) * limitNum;

    // Build where conditions
    const whereConditions = [];
    if (search) {
      whereConditions.push(
        sql`LOWER(${categories.name}) LIKE LOWER(${`%${search}%`})`
      );
    }

    // Build the query
    const categoriesQuery = db
      .select()
      .from(categories)
      .where(whereConditions.length ? and(...whereConditions) : undefined)
      .orderBy(
        sort.toLowerCase() === "asc"
          ? categories.createdAt
          : desc(categories.createdAt)
      )
      .limit(limitNum)
      .offset(offset);

    // Get total count for pagination metadata
    const totalCountQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(categories)
      .where(whereConditions.length ? and(...whereConditions) : undefined);

    const [categoryEntries, _totalCount] = await Promise.all([
      categoriesQuery,
      totalCountQuery
    ]);

    const totalCount = _totalCount[0]?.count || 0;

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);

    return {
      data: {
        data: categoryEntries,
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
      success: false,
      error: (error as Error).message
    };
  }
}

// ================= Get Category by ID =================
export async function getCategoryByIdController(
  id: string
): Promise<GetCategoryByIDResponse> {
  try {
    const db = getDB();

    const category = await db.query.categories.findFirst({
      where: (fields, { eq }) => {
        return eq(fields.id, id);
      }
    });

    if (!category) throw new Error("Category not found");

    return {
      success: true,
      error: null,
      data: category
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

// ================= Create new category =================
export async function createNewCategoryController(
  payload: InsertCategorySchema
): Promise<CreateCategoryResponse> {
  try {
    const db = getDB();

    const [inserted] = await db
      .insert(categories)
      .values({
        name: payload.name
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

// ================= Update category =================
export async function updateCategoryController(
  id: string,
  payload: UpdateCategorySchema
): Promise<UpdateCategoryResponse> {
  try {
    const db = getDB();

    const [updated] = await db
      .update(categories)
      .set(payload)
      .where(eq(categories.id, id))
      .returning();

    if (!updated) throw new Error("Failed to update category");

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

// ================= Delete Category =================
export async function deleteCategoryController(
  id: string
): Promise<DeleteCategoryResponse> {
  try {
    const db = getDB();

    await db.delete(categories).where(eq(categories.id, id)).returning();

    return {
      data: { message: "Category deleted successfully" },
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
