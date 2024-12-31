import productService from "../services/product.service.js";
import categoryService from "../services/category.service.js";

class ProductController {
    async getAll(req, res, next) {
        try {
         
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

    async getProducts(req, res) {
        try {
            const requestQuery = req.query; // Lấy các tham số từ query string
            console.log("get products " + JSON.stringify(requestQuery));
            const result = await productService.getFilteredSortedAndPaginatedProducts(requestQuery);

            // Trả về kết quả
            res.status(200).json({
                success: true,
                data: result,
            });
            
        } catch (error) {
            console.error('Error fetching products:', error.message);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch products.',
            });
        }
    }


}

export default new ProductController();

