/**
 * Controllers List
 * 1. Initialize Transaction
 * 2. Update Transaction Details
 * 3. Add new Transaction Item/s
 * 4. Delete Transaction
 */

import { getDB } from "@/database";
import { transactionItems, transactions } from "@/database/schema";
import { generateUniqueId } from "@/lib/utils";
import { UpdateCategoryResponse } from "@/lib/zod/categories.zod";
import {
  AddNewTransactionItemsResponse,
  BaseTransactionItemSchema,
  CreateTransactionSchema,
  DeleteTransactionResponse,
  InitializeTransactionResponse,
  UninitializedTransactionItem,
  UpdateTransactionSchema
} from "@/lib/zod/transactions.zod";
import { eq } from "drizzle-orm";

// ========= Initialize Transaction Controller =========
export async function initializeTransactionController(
  body: CreateTransactionSchema
): Promise<InitializeTransactionResponse> {
  try {
    const db = getDB();

    // Generate random 12 digits number
    const generatedTransactionNumber = generateUniqueId();

    // Initialize transaction
    const initialized = await db
      .insert(transactions)
      .values({
        ...body,
        subtotalAmount: 0,
        totalAmount: 0,
        transactionNumber: generatedTransactionNumber,
        paymentMethod: "cash"
      })
      .returning();

    if (initialized.length < 1)
      throw new Error("Failed to initialized transaction");

    return {
      data: initialized[0],
      error: null,
      success: true
    };
  } catch (error) {
    return {
      data: null,
      error: (error as Error).message,
      success: false
    };
  }
}

// ========= Update Transaction Controller =========
export async function updateTransactionController(
  id: string,
  body: UpdateTransactionSchema
): Promise<UpdateCategoryResponse> {
  try {
    const db = getDB();

    const updated = await db
      .update(transactions)
      .set(body)
      .where(eq(transactions.id, id))
      .returning();

    if (updated.length < 1) throw new Error("Failed to update transaction");

    return {
      data: updated[0],
      error: null,
      success: true
    };
  } catch (error) {
    return {
      data: null,
      error: (error as Error).message,
      success: false
    };
  }
}

// ========= Add new Transaction Item Controller =========
export async function addNewTransactionItemController(
  transactionId: string,
  items: UninitializedTransactionItem[]
): Promise<AddNewTransactionItemsResponse> {
  try {
    const db = getDB();

    const addedItems: BaseTransactionItemSchema[] = [];

    await Promise.all(
      items.map(async (item) => {
        const addedItem = await db
          .insert(transactionItems)
          .values({
            ...item,
            transactionId: transactionId,
            productName: item.productName!,
            unitPrice: item.unitPrice!,
            unitAmount: item.unitAmount!,
            unit: item.unit!,
            quantity: item?.quantity || 1,
            totalAmount: item?.totalAmount || item?.unitPrice || 0
          })
          .returning();

        if (addedItem.length > 0) addedItems.push(addedItem[0]);
      })
    );

    if (addedItems.length < 1)
      throw new Error("Failed to add new transaction items");

    return {
      data: addedItems,
      error: null,
      success: true
    };
  } catch (error) {
    return {
      data: null,
      error: (error as Error).message,
      success: false
    };
  }
}

// ========= Delete Transaction Controller =========
export async function deleteTransactionController(
  id: string
): Promise<DeleteTransactionResponse> {
  try {
    const db = getDB();

    await db.delete(transactions).where(eq(transactions.id, id));

    return {
      data: { message: "Transaction deleted successfully !" },
      error: null,
      success: true
    };
  } catch (error) {
    return {
      data: null,
      error: (error as Error).message,
      success: false
    };
  }
}
