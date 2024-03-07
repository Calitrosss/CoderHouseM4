export default class ProductsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getProducts = async (limit, page, sort, query) => {
    const products = await this.dao.getProducts(limit, page, sort, query);
    return products;
  };

  getProductById = async (id) => {
    const product = await this.dao.getProductById(id);
    return product;
  };

  addProduct = async (data) => {
    const product = await this.dao.addProduct(data);
    return product;
  };

  updateProduct = async (product) => {
    const result = await this.dao.updateProduct(product);
    return result;
  };

  deleteProduct = async (id) => {
    const result = await this.dao.deleteProduct(id);
    return result;
  };
}
