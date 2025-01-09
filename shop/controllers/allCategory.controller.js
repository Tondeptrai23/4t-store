import allCategoryService from "../services/allCategory.service.js";

class AllCategoryController {
   
    getCategories = async function(req, res, next) {
        try {
            const requestQuery = req.query; 
            console.log("get all categories " + JSON.stringify(requestQuery));
            const result =
                await allCategoryService.getFilteredSortedAndPaginatedCategories(
                    requestQuery
                );

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error("Error fetching all categories:", error.message);
            res.status(500).json({
                success: false,
                message: "Failed to fetch  all categories.",
            });
        }
    };

    async getById(req, res, next) {
        try {
            const isLoggedIn = req.isAuthenticated();
            const productId = req.params.id;

            const product = await productService.getById(productId);
            const rawMoney = product.price;
            product.price = convertVietnameseCurrency(product.price);
            const category = await categoryService.getById(product.categoryId);
            const parentCategory = await categoryService.getParentCategory(
                category.parentId
            );
            const relatedProduct = await categoryService.getRelatedProducts(
                product.categoryId,
                product.productId
            );
            relatedProduct.forEach((product) => {
                product.price = convertVietnameseCurrency(product.price);
            });
            res.render("index", {
                body: "pages/productDetail",
                product,
                category,
                relatedProduct,
                isLoggedIn,
                rawMoney,
                parentCategory,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server Error" });
        }
    }

    async getProducts(req, res) {
        try {
            const requestQuery = req.query; // Lấy các tham số từ query string
            console.log("get products " + JSON.stringify(requestQuery));
            const result =
                await productService.getFilteredSortedAndPaginatedProducts(
                    requestQuery
                );

            // Trả về kết quả
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error("Error fetching products:", error.message);
            res.status(500).json({
                success: false,
                message: "Failed to fetch products.",
            });
        }
    }
}

export default new AllCategoryController();
