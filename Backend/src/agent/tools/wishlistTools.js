import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import User from "../../models/User.js";
import Product from "../../models/Product.js";

/**
 * Factory that creates wishlist tools bound to a specific userId.
 *
 * @param {string} userId - The authenticated user's MongoDB _id
 * @returns {DynamicStructuredTool[]} Array of 3 wishlist tools
 */
export const createWishlistTools = (userId) => {
  const getUser = async () => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    return user;
  };

  const formatWishlist = (wishlist) =>
    wishlist.map((id) => ({ productId: id.toString() }));

  // ── 1. Get Wishlist ──
  const getWishlistTool = new DynamicStructuredTool({
    name: "get_wishlist",
    description:
      "Retrieve the current user's wishlist. " +
      "Use this when the user asks to see their wishlist or saved items.",
    schema: z.object({}),
    func: async () => {
      const user = await getUser();

      if (!user.wishlist || user.wishlist.length === 0) {
        return "The wishlist is empty.";
      }

      return JSON.stringify({ items: formatWishlist(user.wishlist) }, null, 2);
    },
  });

  // ── 2. Add to Wishlist ──
  const addToWishlistTool = new DynamicStructuredTool({
    name: "add_to_wishlist",
    description:
      "Add a product to the user's wishlist. " +
      "Use this ONLY after you have confirmed the exact product the user wants (typically after a search_products call). " +
      "If the product is already in the wishlist, it will not be duplicated.",
    schema: z.object({
      productId: z
        .string()
        .describe("The MongoDB _id of the product to add"),
    }),
    func: async ({ productId }) => {
      const productExists = await Product.findById(productId);
      if (!productExists) {
        return `Error: Product with ID "${productId}" does not exist. Please use search_products first to find a valid product.`;
      }

      const user = await getUser();

      const alreadyExists = user.wishlist.some(
        (id) => id.toString() === productId
      );

      if (alreadyExists) {
        return JSON.stringify(
          { message: "Product is already in the wishlist", items: formatWishlist(user.wishlist) },
          null,
          2
        );
      }

      user.wishlist.push(productId);
      await user.save();

      return JSON.stringify(
        { message: "Product added to wishlist", items: formatWishlist(user.wishlist) },
        null,
        2
      );
    },
  });

  // ── 3. Remove from Wishlist ──
  const removeFromWishlistTool = new DynamicStructuredTool({
    name: "remove_from_wishlist",
    description:
      "Remove a product from the user's wishlist. " +
      "Use when the user wants to remove a saved item from their wishlist.",
    schema: z.object({
      productId: z
        .string()
        .describe("The MongoDB _id of the product to remove"),
    }),
    func: async ({ productId }) => {
      const user = await getUser();

      const before = user.wishlist.length;
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId
      );

      if (user.wishlist.length === before) {
        return "That product was not in the wishlist.";
      }

      await user.save();

      return JSON.stringify(
        { message: "Product removed from wishlist", items: formatWishlist(user.wishlist) },
        null,
        2
      );
    },
  });

  return [getWishlistTool, addToWishlistTool, removeFromWishlistTool];
};
