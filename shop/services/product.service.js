import Image from "../models/image.model.js";
import Product from "../models/product.model.js";
import {
    FilterBuilder,
    PaginationBuilder,
    SortBuilder,
} from "../utils/condition.js";

export class ProductSortBuilder extends SortBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._map = {
            name: ["name"],
            price: ["price"],
            size: ["size"],
            color: ["color"],
            updatedAt: ["updatedAt"],
            createdAt: ["createdAt"],
        };
        this._defaultSort = [["createdAt", "ASC"]];
    }
}

export class ProductFilterBuilder extends FilterBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._allowFields = [
            "productId",
            "name",
            "price",
            "color",
            "categoryId",
            "updatedAt",
            "createdAt",
        ];
    }
}

class ProductService {
    // Lấy danh sách sản phẩm
    getAll = async () => {
        try {
            const products = await Product.findAll({
                include: [
                    {
                        model: Image,
                        as: "images",
                        required: false,
                    },
                ],
            });

            const productsWithImages = products.map((product) =>
                product.toJSON()
            );

            return productsWithImages;
        } catch (error) {
            throw new Error(
                "Error fetching products with images: " + error.message
            );
        }
    };

    // Get sorted, filtered, and paginated products
    getFilteredSortedAndPaginatedProducts = async (requestQuery) => {
        console.log("Query in service:", requestQuery);

        try {

            const preprocessRequestQuery = (query) => {
                let processedQuery = { ...query }; 
                console.log("processed query: ", processedQuery);
             
                if (processedQuery.sort && processedQuery.order) {
                    if (processedQuery.order.toUpperCase() === "DESC") {
                        processedQuery.sort = `-${processedQuery.sort}`;
                    }

                    console.log("Processed query after solve: ", processedQuery);
                }

                return processedQuery;
            };

            const processedQuery = preprocessRequestQuery(requestQuery);

            // Process filtered products
            const filterBuilder = new ProductFilterBuilder(processedQuery);
            const filterCriteria = filterBuilder.build();

            //Process sorted products
            const sortBuilder = new ProductSortBuilder(processedQuery);
            const sortCriteria = sortBuilder.build();

            // Process paginated products
            const paginationBuilder = new PaginationBuilder(processedQuery);
            const { limit, offset } = paginationBuilder.build();

            // Query products from the database
            let productsQuery = await Product.findAll({
                where: filterCriteria,
                order: [...sortCriteria],
                limit,
                offset,
                include: [
                    {
                        model: Image,
                        as: "images",
                        required: false,
                    },
                ],
            });

            
            const totalCount = await Product.count({
                where: filterCriteria,
            });

            // Map the images to the products
            let productsWithImages = productsQuery.map((product) =>
                product.toJSON()
            );

            const totalPages = Math.ceil(totalCount / limit);

            

            return {
                count: totalCount,
                products: productsWithImages,
                pagination: { limit, offset, totalPages }, // Trả lại thông tin phân trang (nếu cần)
            };
        } catch (err) {
            console.error(
                "Error in getFilteredSortedAndPaginatedProducts:",
                err
            );
            throw new Error("Error fetching products.");
        }
    };

    getById = async (productId) => {
        try {
            const product = await Product.findByPk(productId, {
                include: [
                    {
                        model: Image,
                        as: "images",
                    },
                ],
            });

            if (!product) {
                throw new Error(`Product with ID ${productId} not found`);
            }

            return product.toJSON();
        } catch (error) {
            throw new Error(
                "Error fetching product with images: " + error.message
            );
        }
    };

    deleteById = async (productId) => {
        try {
            // First check if the product exists
            const product = await Product.findByPk(productId);

            if (!product) {
                return false;
            }

            // Delete the product
            await Product.destroy({
                where: {
                    productId: productId,
                },
            });

            return true;
        } catch (error) {
            console.error("Error in deleteById:", error);
            throw new Error("Failed to delete product");
        }
    };

    bulkDelete = async (productIds) => {
        try {
            const result = await Product.destroy({
                where: {
                    productId: productIds,
                },
            });

            return result;
        } catch (error) {
            console.error("Error in bulkDelete:", error);
            throw new Error("Failed to delete products");
        }
    };

    create = async (productData) => {
        try {
            const product = await Product.create(productData, {
                include: [
                    {
                        model: Image,
                        as: "images",
                    },
                ],
            });

            return product.toJSON();
        } catch (error) {
            console.error("Error creating product:", error);
            throw new Error("Failed to create product: " + error.message);
        }
    };

    update = async (productId, productData) => {
        try {
            const { image, ...updateData } = productData;

            const product = await Product.findByPk(productId);
            if (!product) {
                throw new Error(`Product with ID ${productId} not found`);
            }

            await product.update(updateData);

            if (image) {
                await Image.destroy({ where: { productId } });
                await Image.create({
                    ...image,
                    productId,
                    displayOrder: 0,
                });
            }

            return await Product.findByPk(productId, {
                include: [
                    {
                        model: Image,
                        as: "images",
                    },
                ],
            });
        } catch (error) {
            throw new Error("Failed to update product: " + error.message);
        }
    };
}

export default new ProductService();
