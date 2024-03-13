export const productErrorTypeInfo = (product) => {
  return `One or more properties are incomplete or not valid.
    List of required properties:
    * title: ${
      !product.title
        ? `needs to be a string, received <${typeof product.title}>: ${product.title || "empty"}`
        : "OK"
    }
    * description: ${
      !product.description
        ? `needs to be a string, received <${typeof product.description}>: ${
            product.description || "empty"
          }`
        : "OK"
    }
    * code: ${
      !product.code
        ? `needs to be a string, received <${typeof product.code}>: ${product.code || "empty"}`
        : "OK"
    }
    * price: ${
      !product.price || typeof product.price !== "number"
        ? `needs to be a number, received <${typeof product.price}>: ${product.price || "empty"}`
        : "OK"
    }
    * status: ${
      !product.status || typeof product.status !== "boolean"
        ? `needs to be a boolean, received <${typeof product.status}>: ${product.status || "empty"}`
        : "OK"
    }
    * stock: ${
      !product.stock || typeof product.stock !== "number"
        ? `needs to be a number, received <${typeof product.stock}>: ${product.stock || "empty"}`
        : "OK"
    }
    * category: ${
      !product.category
        ? `needs to be a string, received <${typeof product.category}>: ${
            product.category || "empty"
          }`
        : "OK"
    }`;
};

export const productInvalidParamInfo = (product) => {
  return `One or more properties values are invalid.
      List of valid properties:
      * title: ${product.title.trim().length === 0 ? `could not be empty` : "OK"}
      * description: ${product.description < 0 ? `could not be empty` : "OK"}
      * code: ${product.code < 0 ? `could not be empty` : "OK"}
      * price: ${product.price < 0 ? `could not be < 0, received ${product.price}` : "OK"}
      * stock: ${product.stock < 0 ? `could not be < 0, received ${product.stock}` : "OK"}
      * category: ${product.category < 0 ? `could not be empty` : "OK"}`;
};
