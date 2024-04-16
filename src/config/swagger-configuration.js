export const swaggerConfiguration = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Ecommerce",
      description: "Es una API de productos y carritos de un ecommerce",
    },
  },
  apis: ["src/docs/**/*.yaml"],
};
