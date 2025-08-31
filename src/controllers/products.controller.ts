import { getDB } from "@/database";
import { products } from "@/database/schema";
import { QueryParamsSchema } from "@/lib/zod/helpers";
import {
  CreateProductResponse,
  DeleteProductResponse,
  GetProductByBarcodeResponse,
  GetProductByIDResponse,
  InsertProductSchema,
  UpdateProductResponse,
  UpdateProductSchema,
  type GetAllProductsResponse
} from "@/lib/zod/products.zod";
import { and, desc, eq, sql } from "drizzle-orm";

// ================= Get all products Controller =================
export async function getAllProductsController(
  query: QueryParamsSchema
): Promise<GetAllProductsResponse> {
  try {
    const db = getDB();
    const { search, page, limit, sort } = query;

    // Convert to numbers and validate
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
    const offset = (pageNum - 1) * limitNum;

    // Build where conditions
    const whereConditions: any[] = [];

    if (search) {
      whereConditions.push(
        sql`LOWER(${products.name}) LIKE LOWER(${`%${search}%`})`
      );
    }

    db.query.products.findMany({
      where: whereConditions.length ? and(...whereConditions) : undefined,
      orderBy:
        sort.toLowerCase() === "asc"
          ? products.createdAt
          : desc(products.createdAt),
      limit: limitNum,
      offset,
      with: {
        category: true
      }
    });

    const productsQuery = db.query.products.findMany({
      where: whereConditions.length ? and(...whereConditions) : undefined,
      orderBy:
        sort.toLowerCase() === "asc"
          ? products.createdAt
          : desc(products.createdAt),
      limit: limitNum,
      offset,
      with: {
        category: true
      }
    });

    // Get total count for pagination metadata
    const totalCountQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(whereConditions.length ? and(...whereConditions) : undefined);

    const [productEntries, _totalCount] = await Promise.all([
      productsQuery,
      totalCountQuery
    ]);

    const totalCount = _totalCount[0]?.count || 0;

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);

    return {
      data: {
        data: productEntries,
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

// ================= Get Product by ID =================
export async function getProductByIDController(
  id: string
): Promise<GetProductByIDResponse> {
  try {
    const db = getDB();

    const product = await db.query.products.findFirst({
      where: (fields, { eq }) => {
        return eq(fields.id, id);
      },
      with: {
        category: true
      }
    });

    if (!product) throw new Error("Product not found");

    return {
      success: true,
      error: null,
      data: product
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

// ================= Get Product by barcode =================
export async function getProductByBarcodeController(
  barcode: string
): Promise<GetProductByBarcodeResponse> {
  try {
    const db = getDB();

    const product = await db.query.products.findFirst({
      where: (fields, { eq }) => {
        return eq(fields.barcode, barcode);
      }
    });

    if (!product) throw new Error("Product not found");

    return {
      success: true,
      error: null,
      data: product
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

// ================= Create new prduct =================
export async function createNewProductController(
  payload: InsertProductSchema
): Promise<CreateProductResponse> {
  try {
    const db = getDB();

    const [inserted] = await db
      .insert(products)
      .values({
        name: payload.name,
        barcode: payload.barcode,
        price: payload.price,
        discountedPrice: payload.discountedPrice,
        stockQuantity: payload.stockQuantity,
        unit: payload.unit,
        description: payload.description,
        imageFilename: payload.imageFilename,
        isActive: payload.isActive,
        categoryId: payload.categoryId
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

// ================= Update product =================
export async function updateProductController(
  id: string,
  payload: UpdateProductSchema
): Promise<UpdateProductResponse> {
  try {
    const db = getDB();

    const [updated] = await db
      .update(products)
      .set(payload)
      .where(eq(products.id, id))
      .returning();

    if (!updated) throw new Error("Failed to update product");

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

// ================= Delete Product =================
export async function deleteProductController(
  id: string
): Promise<DeleteProductResponse> {
  try {
    const db = getDB();

    await db.delete(products).where(eq(products.id, id)).returning();

    return {
      data: { message: "Product deleted successfully" },
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
