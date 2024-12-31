import CartItem from "./models/cartItem.model.js";
import Category from "./models/category.model.js";
import Image from "./models/image.model.js";
import db from "./models/index.model.js";
import Order from "./models/order.model.js";
import OrderItem from "./models/orderItem.model.js";
import Product from "./models/product.model.js";
import User from "./models/user.model.js";
import bcrypt from "bcrypt";

db.drop();
db.sync({ force: true })
    .then(async (res) => {
        console.log("Database connected");
        await seedData();
    })
    .catch((err) => console.log(err));

const seedData = async () => {
    const salt = await bcrypt.genSalt(10);
    const users = [
        {
            userId: "1",
            name: "John Admin",
            email: "admin@example.com",
            password: await bcrypt.hash("admin123", salt),
            role: "admin",
        },
        {
            userId: "2",
            name: "Jane User",
            email: "user@example.com",
            password: await bcrypt.hash("user123", salt),
            role: "user",
        },
    ];

    const categories = [
        {
            categoryId: "1",
            name: "T-Shirts",
            description: "Casual and comfortable t-shirts for everyday wear",
        },
        {
            categoryId: "2",
            name: "Hoodies",
            description: "Warm and cozy hoodies for cold weather",
        },
        {
            categoryId: "3",
            name: "Jeans",
            description: "Classic denim jeans in various styles",
        },
        {
            categoryId: "4",
            name: "Dresses",
            description: "Elegant dresses for various occasions",
        },
        {
            categoryId: "5",
            name: "Shorts",
            description: "Comfortable shorts for sports and leisure activities",
        },
    ];

    const products = [
        // T-Shirts (categoryId: 1)
        {
            productId: "1",
            categoryId: "1",
            name: "Basic Cotton T-Shirt - Black M",
            description: "Classic cotton t-shirt in solid color",
            price: 19.99,
            size: "M",
            color: "Black",
        },
        {
            productId: "2",
            categoryId: "1",
            name: "Graphic Print T-Shirt - White L",
            description: "Cotton t-shirt with artistic print",
            price: 24.99,
            size: "L",
            color: "White",
        },
        {
            productId: "3",
            categoryId: "1",
            name: "Striped T-Shirt - Blue S",
            description: "Classic striped pattern t-shirt",
            price: 22.99,
            size: "S",
            color: "Blue",
        },
        {
            productId: "4",
            categoryId: "1",
            name: "Longsleeve T-Shirt - Grey XL",
            description: "Warmful longsleeve t-shirt",
            price: 21.99,
            size: "XL",
            color: "Grey",
        },
        {
            productId: "5",
            categoryId: "1",
            name: "Cotton T-Shirt - Red M",
            description: "Simple cotton t-shirt",
            price: 25.99,
            size: "M",
            color: "Red",
        },
        // Hoodies (categoryId: 2)
        {
            productId: "6",
            categoryId: "2",
            name: "Basic Hoodie - Black M",
            description: "Classic pullover hoodie",
            price: 39.99,
            size: "M",
            color: "Black",
        },
        {
            productId: "7",
            categoryId: "2",
            name: "Zip-Up Hoodie - Grey L",
            description: "Convenient zip-up style hoodie",
            price: 44.99,
            size: "L",
            color: "Grey",
        },
        {
            productId: "8",
            categoryId: "2",
            name: "Sport Hoodie - Blue XL",
            description: "Athletic style hoodie",
            price: 49.99,
            size: "XL",
            color: "Blue",
        },
        {
            productId: "9",
            categoryId: "2",
            name: "Winter Hoodie - Red M",
            description: "Thick winter hoodie",
            price: 54.99,
            size: "M",
            color: "Red",
        },
        {
            productId: "10",
            categoryId: "2",
            name: "Casual Hoodie - Grey S",
            description: "Lightweight casual hoodie",
            price: 42.99,
            size: "S",
            color: "Grey",
        },
        // Jeans (categoryId: 3)
        {
            productId: "11",
            categoryId: "3",
            name: "Slim Fit Jeans - Blue M",
            description: "Classic slim fit denim jeans",
            price: 49.99,
            size: "M",
            color: "Blue",
        },
        {
            productId: "12",
            categoryId: "3",
            name: "Straight Cut Jeans - Blue L",
            description: "Traditional straight cut jeans",
            price: 47.99,
            size: "L",
            color: "Blue",
        },
        {
            productId: "13",
            categoryId: "3",
            name: "Skinny Jeans - Black S",
            description: "Modern skinny fit jeans",
            price: 52.99,
            size: "S",
            color: "Black",
        },
        {
            productId: "14",
            categoryId: "3",
            name: "Relaxed Fit Jeans - Blue XL",
            description: "Comfortable relaxed fit jeans",
            price: 48.99,
            size: "XL",
            color: "Blue",
        },
        {
            productId: "15",
            categoryId: "3",
            name: "Graphic Print Boot Cut Jeans - Blue M",
            description: "Classic boot cut style jeans",
            price: 50.99,
            size: "M",
            color: "Blue",
        },
        // Dresses (categoryId: 4)
        {
            productId: "16",
            categoryId: "4",
            name: "Summer Dress - Red S",
            description: "Light and flowy summer dress",
            price: 45.99,
            size: "S",
            color: "Red",
        },
        {
            productId: "17",
            categoryId: "4",
            name: "Maxi Dress - Black M",
            description: "Elegant maxi length dress",
            price: 55.99,
            size: "M",
            color: "Black",
        },
        {
            productId: "18",
            categoryId: "4",
            name: "Cocktail Dress - Blue L",
            description: "Stylish cocktail party dress",
            price: 65.99,
            size: "L",
            color: "Blue",
        },
        {
            productId: "19",
            categoryId: "4",
            name: "Casual Dress - White S",
            description: "Comfortable casual dress",
            price: 42.99,
            size: "S",
            color: "White",
        },
        {
            productId: "20",
            categoryId: "4",
            name: "Party Dress - Purple M",
            description: "Fancy party wear dress",
            price: 59.99,
            size: "M",
            color: "Purple",
        },
        // Shorts (categoryId: 5)
        {
            productId: "21",
            categoryId: "5",
            name: "Running Shorts - Black M",
            description: "Lightweight running shorts",
            price: 29.99,
            size: "M",
            color: "Black",
        },
        {
            productId: "22",
            categoryId: "5",
            name: "Cargo Shorts - White L",
            description: "Durable cargo shorts with multiple pockets",
            price: 34.99,
            size: "L",
            color: "White",
        },
        {
            productId: "23",
            categoryId: "5",
            name: "Denim Shorts - Blue S",
            description: "Classic denim shorts",
            price: 27.99,
            size: "S",
            color: "Blue",
        },
        {
            productId: "24",
            categoryId: "5",
            name: "Board Shorts - Red XL",
            description: "Comfortable board shorts for swimming",
            price: 32.99,
            size: "XL",
            color: "Red",
        },
        {
            productId: "25",
            categoryId: "5",
            name: "Gym Shorts - Grey M",
            description: "Breathable gym shorts",
            price: 24.99,
            size: "M",
            color: "Grey",
        },
    ];
    const images = [
        // T-Shirts Images
        {
            imageId: "101",
            productId: "1",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "tshirt-1-black.jpg",
        },
        {
            imageId: "201",
            productId: "2",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "tshirt-2-white.jpg",
        },
        {
            imageId: "202",
            productId: "2",
            contentType: "image/jpeg",
            displayOrder: 2,
            path: "tshirt-2-white-2.jpg",
        },
        {
            imageId: "301",
            productId: "3",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "tshirt-3-blue.jpg",
        },
        {
            imageId: "401",
            productId: "4",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "tshirt-4-grey.jpg",
        },
        {
            imageId: "501",
            productId: "5",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "tshirt-5-red.jpg",
        },
        // Hoodies Images
        {
            imageId: "601",
            productId: "6",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "hoodie-6-black.jpg",
        },
        {
            imageId: "701",
            productId: "7",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "hoodie-7-grey.jpg",
        },
        {
            imageId: "801",
            productId: "8",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "hoodie-8-blue.jpg",
        },
        {
            imageId: "901",
            productId: "9",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "hoodie-9-red.jpg",
        },
        {
            imageId: "1001",
            productId: "10",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "hoodie-10-grey.jpg",
        },
        // Jeans Images
        {
            imageId: "1101",
            productId: "11",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "jeans-11-blue.jpg",
        },
        {
            imageId: "1201",
            productId: "12",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "jeans-12-blue.jpg",
        },
        {
            imageId: "1301",
            productId: "13",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "jeans-13-black.jpg",
        },
        {
            imageId: "1401",
            productId: "14",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "jeans-14-blue.jpg",
        },
        {
            imageId: "1501",
            productId: "15",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "jeans-15-blue.jpg",
        },
        // Dresses Images
        {
            imageId: "1601",
            productId: "16",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "dress-16-red.jpg",
        },
        {
            imageId: "1701",
            productId: "17",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "dress-17-black.jpg",
        },
        {
            imageId: "1801",
            productId: "18",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "dress-18-blue.jpg",
        },
        {
            imageId: "1901",
            productId: "19",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "dress-19-white.jpg",
        },
        {
            imageId: "2001",
            productId: "20",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "dress-20-purple.jpg",
        },
        // Shorts Images
        {
            imageId: "2101",
            productId: "21",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "shorts-21-black.jpg",
        },
        {
            imageId: "2201",
            productId: "22",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "shorts-22-white.jpg",
        },
        {
            imageId: "2301",
            productId: "23",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "shorts-23-blue.jpg",
        },
        {
            imageId: "2401",
            productId: "24",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "shorts-24-red.jpg",
        },
        {
            imageId: "2501",
            productId: "25",
            contentType: "image/jpeg",
            displayOrder: 1,
            path: "shorts-25-grey.jpg",
        },
    ];

    const orders = [
        {
            orderId: "1",
            userId: "2",
            status: "delivered",
            total: 150.0,
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-05T00:00:00Z",
        },
        {
            orderId: "2",
            userId: "2",
            status: "processing",
            total: 89.99,
            createdAt: "2024-02-01T00:00:00Z",
            updatedAt: "2024-02-01T00:00:00Z",
        },
    ];

    const orderItems = [
        {
            orderItemId: "1",
            orderId: "1",
            productId: "1",
            quantity: 2,
            priceAtPurchase: 19.99,
        },
        {
            orderItemId: "2",
            orderId: "1",
            productId: "6",
            quantity: 1,
            priceAtPurchase: 39.99,
        },
        {
            orderItemId: "3",
            orderId: "2",
            productId: "11",
            quantity: 1,
            priceAtPurchase: 49.99,
        },
        {
            orderItemId: "4",
            orderId: "2",
            productId: "21",
            quantity: 2,
            priceAtPurchase: 34.99,
        },
    ];

    const cartItems = [
        {
            cartItemId: "1",
            userId: "2",
            productId: "1",
            quantity: 2,
        },
        {
            cartItemId: "2",
            userId: "2",
            productId: "6",
            quantity: 1,
        },
    ];

    await User.bulkCreate(users);
    await Category.bulkCreate(categories);
    await Product.bulkCreate(products);
    await Image.bulkCreate(images);
    await Order.bulkCreate(orders);
    await OrderItem.bulkCreate(orderItems);
    await CartItem.bulkCreate(cartItems);
};
export default seedData;
