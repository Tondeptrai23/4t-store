import Product from '../models/product.model.js'
import Image from '../models/image.model.js';



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
    
            const productsWithImages = products.map(product => product.toJSON());
            
            return productsWithImages;
        } catch (error) {
            throw new Error("Error fetching products with images: " + error.message);
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
            throw new Error("Error fetching product with images: " + error.message);
        }
    };
    
    
}

export default new ProductService();


