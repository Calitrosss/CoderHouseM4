import { Faker, es, en } from "@faker-js/faker";

const faker = new Faker({
  locale: [es, en],
});

export const generateProduct = () => {
  const numOfThumbnails = faker.number.int({ min: 1, max: 5 });
  const thumbnails = [];
  for (let index = 0; index < numOfThumbnails; index++) {
    thumbnails.push(faker.image.url());
  }

  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.string.alphanumeric({ length: 10, casing: "upper" }),
    price: +faker.commerce.price(),
    status: faker.datatype.boolean(),
    stock: faker.number.int({ min: 0, max: 50 }),
    category: faker.commerce.product(),
    thumbnails,
  };
};
