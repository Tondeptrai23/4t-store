# WEB PROJECT

## Installations

### Preparation

1. Install MySQL8.0, Nodejs.

2. Create new database

3. Create a `.env` file based on the `.env.sample` file.

### Signed SSL Certificate

Create the ssl directory inside the payment directory:

```bash
# Create ssl directory
mkdir payment/ssl
cd payment/ssl
```

Run the following command to generate a self-signed SSL certificate.

```bash
# Generate SSL certificates
openssl genrsa -out key.pem 2048
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
```

### Execution

Before any coding or running, run this below command to install all the dependencies.

```bash
npm install
```

To run both servers, run this below command.

```bash
npm start
```

Or you can run each server separately.

```bash
npm run start:shop
npm run start:payment
```

### Data Initialization

By default, sequelize will create the tables based on the models. If you want to initialize the data for both servers, you can run the following command.

```bash
npm run seed:all
```

Sometimes, you may want to reset the database when sequelize cannot drop the tables. You should drop the database manually in MySQL workbench.

Or you can seed two servers separately.

```bash
npm run seed:shop
npm run seed:payment
```

### Helper Classes Instructions

1. **Sorting**

-   First, implement base class `SortBuilder` and define the sorting fields in the constructor.

```javascript
export default class ProductSortBuilder extends SortBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._map = {
            name: ["name"],
            price: ["price"],
            createdAt: ["createdAt"],
            updatedAt: ["updatedAt"],
        };
        this._defaultSort = [["createdAt", "DESC"]];
    }
}
```

-   Then, create a new instance of the class and call the `build` method to get the sorting array.

```javascript
const sortBuilder = new ProductSortBuilder(req.query);
const sort = sortBuilder.build();

await Product.findAll({
    order: [...sort],
});
```

-   The sorting fields can be passed in the query string. The fields are separated by commas, '-' prefix means descending order. For example, the following query string will sort the products by name in ascending order and price in descending order.

```bash
api/products?sort=name,-price
```

2. **Pagination**

-   Use the `PaginationBuilder` class to build the pagination object.

```javascript
const paginationBuilder = new PaginationBuilder(req.query);
const { limit, offset } = paginationBuilder.build();

await Product.findAll({
    limit,
    offset,
});
```

-   The pagination fields can be passed in the query string. The default limit is 10 and the default offset is 0. For example, the following query string will return the first 10 products.

```bash
api/products?page=1
```

3. **Filtering**

-   First, implement base class `FilterBuilder` and define the filtering fields in the constructor.

```javascript
export default class ProductFilterBuilder extends FilterBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._allowFields = [
            "productId",
            "name",
            "price",
            "updatedAt",
            "createdAt",
        ];
    }
}
```

-   Then, create a new instance of the class and call the `build` method to get the filtering object.

```javascript
const filterBuilder = new ProductFilterBuilder(req.query);
const filter = filterBuilder.build();

await Product.findAll({
    where: { ...filter },
});
```

-   The filtering supports multiple comparison operators, such as `ne`, `gt`, `gte`, `lt`, `lte`, `like`, `between` and multiple fields at a time. For example, the following query string will filter the products whose name contains 'apple' and price is greater than or equal to 100.

```bash
api/products?name=[like]apple&price=[gte]100
```

4. **Combining**

-   You can combine the sorting, pagination and filtering together. For example, the following query string will filter the products whose name contains 'apple', price is greater than or equal to 100, less than 200, sort by name in ascending order, and return the second page with 10 products.

```bash
api/products?name=[like]apple&price=[gte]100&price=[lt]200&sort=name&page=2&size=10
```
