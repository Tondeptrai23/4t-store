import productService from "../services/product.service.js";
import categoryService from "../services/category.service.js";
import subCategoryService from "../services/subCategory.service.js";

class ProductController {
    async getAll(req, res, next) {
        try {

            const page = parseInt(req.query.page) || 1;
            const limit = 8; // Số sản phẩm mỗi trang
            
            // Gọi service và chờ kết quả trả về
            const products = await productService.getAll();
            const categories = await categoryService.getAll();
            const subcategories = await subCategoryService.getAll();

            const totalProducts = products.length; // Tổng số sản phẩm
            const totalPages = Math.ceil(totalProducts / limit);
            
            // Render trang EJS với danh sách sản phẩm
            res.render('index', { body: 'pages/productlist', products, categories, subcategories, totalPages, currentPage: page});

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

