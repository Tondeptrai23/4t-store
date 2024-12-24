import productService from "../services/product.service.js";
import categoryService from "../services/category.service.js";
import {convertVietnameseMoney } from "../utils/utils.js";
class ProductController {
    async getAll(req, res, next) {
        try {
            console.log("get function called");
            
            // Gọi service và chờ kết quả trả về
            const products = await productService.getAll();
            const formattedProducts = products.map(product => {
                product.price = convertVietnameseMoney(product.price);
                return product;
            });
            const categories = await categoryService.getAll();
            
            // Render trang EJS với danh sách sản phẩm
            res.render('index', { body: 'pages/productlist', products: formattedProducts, categories });
    
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server Error" });
        }
    }
    async getById(req, res, next) {
        try {
            const productId = req.params.id;

            const product = await productService.getById(productId);
            product.price = convertVietnameseMoney(product.price);
            const category = await categoryService.getById(product.categoryId);
            const parentCategory = await categoryService.getParentCategory(category.parentId);
            const relatedProduct = await categoryService.getRelatedProducts(product.categoryId, product.productId);
            relatedProduct.forEach(product => {
                product.price = convertVietnameseMoney(product.price);
            });
            res.render('index', { body: 'pages/productDetail', product, category, relatedProduct, parentCategory });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server Error" });
        }
    }

}

export default new ProductController();

