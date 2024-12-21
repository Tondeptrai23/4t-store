import productService from "../services/product.service.js";
import categoryService from "../services/category.service.js";

class ProductController {
    async getAll(req, res, next) {
        try {
            console.log("get function called");
            
            // Gọi service và chờ kết quả trả về
            const products = await productService.getAll();
            const categories = await categoryService.getAll();
            
            // Render trang EJS với danh sách sản phẩm
            res.render('index', { body: 'pages/productlist', products, categories });
    
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server Error" });
        }
    }
    async getById(req, res, next) {
        try {
            // Lấy productId từ URL
            const productId = req.params.id;

            // Gọi service và chờ kết quả trả về
            const product = await productService.getById(productId);
            const category = await categoryService.getById(product.categoryId);
            const sameCategoryProducts = await categoryService.getCategoryByParentId(1);

            // Render trang EJS với sản phẩm tương ứng
            res.render('index', { body: 'pages/productDetail', product, category, sameCategoryProducts });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server Error" });
        }
    }

}

export default new ProductController();

