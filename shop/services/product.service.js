import Product from '../models/product.model.js'
import Image from '../models/image.model.js';
import SubCategory from '../models/subCategory.model.js';

import { Sequelize, Op } from 'sequelize';

import { SortBuilder, FilterBuilder, PaginationBuilder } from '../utils/condition.js';
import { query } from 'express';


export class ProductSortBuilder extends SortBuilder {
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


export class ProductFilterBuilder extends FilterBuilder {
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

class ProductService {
    // Lấy danh sách sản phẩm
    getAll = async () => {
        try {
            const products = await Product.findAll(); // Lấy tất cả sản phẩm
            const images = await Image.findAll(); // Lấy tất cả hình ảnh

            // Gắn hình ảnh vào từng sản phẩm
            const productsWithImages = products.map(product => {
                // Lọc danh sách hình ảnh có productId tương ứng
                const productImages = images.filter(image => image.productId == product.productId);
                return {
                    ...product.toJSON(),
                    images: productImages, // Thêm trường Images chứa danh sách hình ảnh
                };
            });

            return productsWithImages;
        } catch (error) {
            throw new Error("Error fetching products with images: " + error.message);
        }
    };

    // Lấy danh sách sản phẩm của một danh mục
    getFilteredSortedAndPaginatedProducts = async (requestQuery) => {
        try {
            // Khởi tạo và xử lý bộ lọc
            const filterBuilder = new ProductFilterBuilder(requestQuery);
            const filterCriteria = filterBuilder.build();
    
            // Khởi tạo và xử lý bộ sắp xếp
            const sortBuilder = new ProductSortBuilder(requestQuery);
            const sortCriteria = sortBuilder.build();
    
            // Truy vấn dữ liệu từ database
            const productsQuery = await Product.findAll({
                where: { ...filterCriteria },
                order: [...sortCriteria]
            });
    
    
            return {
                products: productsQuery
            };
        } catch (err) {
            console.error(err);
            throw new Error("Error fetching products.");
        }
    };
    
    
    
}

export default new ProductService();


