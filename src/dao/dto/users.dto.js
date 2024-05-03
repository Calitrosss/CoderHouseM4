export default class UsersDTO {
  constructor(user) {
    this.id = user._id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.fullName = `${this.first_name} ${this.last_name}`;
    this.email = user.email;
    this.age = user.age;
    this.cart = user.cart;
    this.role = user.role;
  }
}
