export default class CartsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getCarts = async () => {
    const carts = await this.dao.getCarts();
    return carts;
  };

  getProductsByCartId = async (id) => {
    const products = await this.dao.getProductsByCartId(id);
    return products;
  };

  createCart = async (data) => {
    const result = await this.dao.createCart(data);
    return result;
  };

  addProductToCart = async (cid, pid, quantity, uid) => {
    const result = await this.dao.addProductToCart(cid, pid, quantity, uid);
    return result;
  };

  removeProductFromCart = async (cid, pid) => {
    const result = await this.dao.removeProductFromCart(cid, pid);
    return result;
  };

  updateCartProducts = async (cid, products) => {
    const result = await this.dao.updateCartProducts(cid, products);
    return result;
  };

  updateCartProductQuantity = async (cid, pid, quantity) => {
    const result = await this.dao.updateCartProductQuantity(cid, pid, quantity);
    return result;
  };

  emptyCart = async (cid) => {
    const result = await this.dao.emptyCart(cid);
    return result;
  };

  makePurchase = async (cid, purchaser) => {
    const result = await this.dao.makePurchase(cid, purchaser);
    return result;
  };
}
