export const addToWishlistTool = {
  name: "add_to_wishlist",
  description: "Add a product to user's wishlist",
  schema: {
    userId: "string",
    productId: "string"
  },
  func: async ({ userId, productId }) => {
    // call wishlist API
  }
}

export const removeFromWishlistTool = {
  name: "remove_from_wishlist",
  description: "Remove a product from wishlist",
  schema: {
    userId: "string",
    productId: "string"
  },
  func: async ({ userId, productId }) => {
    // call API
  }
}

export const viewWishlistTool = {
  name: "view_wishlist",
  description: "Get user's wishlist items",
  schema: {
    userId: "string"
  },
  func: async ({ userId }) => {
    // return wishlist
  }
}