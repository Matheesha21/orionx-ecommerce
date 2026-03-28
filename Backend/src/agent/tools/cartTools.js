import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import User from "../../models/User.js";
import Product from "../../models/Product.js";

/**
 * Factory that creates cart tools bound to a specific userId.
 * The userId is captured via closure so the LLM never needs to supply it.
 *
 * @param {string} userId - The authenticated user's MongoDB _id
 * @returns {DynamicStructuredTool[]} Array of 4 cart tools
 */
export const createCartTools = (userId) => {
  // ── Helper: fetch user cart (no populate, just productId + quantity) ──
  const getUser = async () => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    return user;
  };

  const formatCart = (cart) =>
    cart.map((item) => ({
      productId: item.product.toString(),
      quantity: item.quantity,
    }));

  // ── 1. Get Cart ──
  const getCartTool = new DynamicStructuredTool({
    name: "get_cart",
    description:
      "Retrieve the current user's shopping cart contents. " +
      "Use this when the user asks to see their cart, check what's in it, " +
      "or asks about their total.",
    schema: z.object({}),
    func: async () => {
      const user = await getUser();

      if (user.cart.length === 0) {
        return "The cart is empty.";
      }

      return JSON.stringify({ items: formatCart(user.cart) }, null, 2);
    },
  });

  // ── 2. Add to Cart ──
  const addToCartTool = new DynamicStructuredTool({
    name: "add_to_cart",
    description:
      "Add a product to the user's shopping cart. " +
      "Use this ONLY after you have confirmed the exact product the user wants (typically after a search_products call). " +
      "If the product is already in the cart, its quantity will be incremented.",
    schema: z.object({
      productId: z
        .string()
        .describe("The MongoDB _id of the product to add"),
      quantity: z
        .number()
        .int()
        .min(1)
        .default(1)
        .describe("Number of units to add (defaults to 1)"),
    }),
    func: async ({ productId, quantity = 1 }) => {
      // Validate the product actually exists before adding
      const productExists = await Product.findById(productId);
      if (!productExists) {
        return `Error: Product with ID "${productId}" does not exist. Please use search_products first to find a valid product.`;
      }

      const user = await getUser();

      const itemIndex = user.cart.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        user.cart[itemIndex].quantity += quantity;
      } else {
        user.cart.push({ product: productId, quantity });
      }

      await user.save();

      return JSON.stringify(
        { message: "Product added to cart", items: formatCart(user.cart) },
        null,
        2
      );
    },
  });

  // ── 3. Remove from Cart ──
  const removeFromCartTool = new DynamicStructuredTool({
    name: "remove_from_cart",
    description:
      "Remove a product entirely from the user's cart. " +
      "Use when the user wants to delete an item from their cart.",
    schema: z.object({
      productId: z
        .string()
        .describe("The MongoDB _id of the product to remove"),
    }),
    func: async ({ productId }) => {
      const user = await getUser();

      const before = user.cart.length;
      user.cart = user.cart.filter(
        (item) => item.product.toString() !== productId
      );

      if (user.cart.length === before) {
        return "That product was not in the cart.";
      }

      await user.save();

      return JSON.stringify(
        { message: "Product removed from cart", items: formatCart(user.cart) },
        null,
        2
      );
    },
  });

  return [getCartTool, addToCartTool, removeFromCartTool];
};
