import categoryService from "../services/category.service.js";
import productService from "../services/product.service.js";
import subCategoryService from "../services/subCategory.service.js";
import { convertVietnameseCurrency } from "../utils/utils.js";

class ProductController {
    async getAll(req, res, next) {
        try {
            const isLoggedIn = req.isAuthenticated();

            // Gọi service và chờ kết quả trả về
            const data =
                await productService.getFilteredSortedAndPaginatedProducts(
                    req.query
                );
            const products = data.products || [];
            const page = data.pagination.page || 1;
            const limit = data.pagination.limit || 8;
            const totalProducts = data.count || products.length; // Tổng số sản phẩm
            const totalPages =
                data.pagination.totalPages || Math.ceil(totalProducts / limit);

            const formattedProducts = products.map((product) => {
                product.price = convertVietnameseCurrency(product.price);
                return product;
            });

            const categories = await categoryService.getAll();
            const subcategories = await subCategoryService.getAll();

            // Render trang EJS với danh sách sản phẩm
            res.render("index", {
                body: "pages/productlist",
                products: formattedProducts,
                categories,
                subcategories,
                totalPages,
                currentPage: page,
                isLoggedIn: isLoggedIn,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server Error" });
        }
    }
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
                rawMoney,
                isLoggedIn: isLoggedIn,
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

export default new ProductController();
