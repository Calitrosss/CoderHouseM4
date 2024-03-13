export const productErrorTypeInfo = (product) => {
  return `One or more properties are incomplete or not valid.
    List of required properties:
    * title: ${
      !product.title || product.title.trim().length === 0
        ? `needs to be a non empty string, received <${typeof product.title}>: ${
            product.title?.trim() || "empty"
          }`
        : "OK"
    }
    * description: ${
      !product.description || product.description.trim().length === 0
        ? `needs to be a non empty string, received <${typeof product.description}>: ${
            product.description?.trim() || "empty"
          }`
        : "OK"
    }
    * code: ${
      !product.code || product.code.trim().length === 0
        ? `needs to be a non empty string, received <${typeof product.code}>: ${
            product.code?.trim() || "empty"
          }`
        : "OK"
    }
    * price: ${
      !product.price || typeof product.price !== "number" || product.price < 0
        ? `needs to be a non negative number, received <${typeof product.price}>: ${
            product.price || "empty"
          }`
        : "OK"
    }
    * status: ${
      !product.status || typeof product.status !== "boolean"
        ? `needs to be a boolean, received <${typeof product.status}>: ${product.status || "empty"}`
        : "OK"
    }
    * stock: ${
      !product.stock || typeof product.stock !== "number" || product.stock < 0
        ? `needs to be a non negative number, received <${typeof product.stock}>: ${
            product.stock || "empty"
          }`
        : "OK"
    }
    * category: ${
      !product.category || product.category.trim().length === 0
        ? `needs to be a non empty string, received <${typeof product.category}>: ${
            product.category?.trim() || "empty"
          }`
        : "OK"
    }`;
};
