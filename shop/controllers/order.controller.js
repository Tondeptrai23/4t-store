import orderService from "../services/order.service.js";
import OrderItemService from '../services/orderItems.service.js';
import api from "../config/api.js";
import bodyParser from "body-parser";
import { body } from "express-validator";

class OrderController{
    async getAll(req, res){
        try{
            const orders = await orderService.getAll();
            res.status(200).send(orders);
        }catch(error){
            res.status(400).send(error.message);
        }
    }

    async getById(req, res){
        try{
            const order = await orderService.getById(req.params.id);
            res.status(200).send(order);
        }catch(error){
            res.status(400).send(error.message);
        }
    }

    async create(req, res){
        try {
            const orderData = {
                total: req.body.total,
                address: req.body.address,
                userId: req.user.userId
            };
            const cartItems = req.body.cart;
        
            const order = await orderService.create(orderData);
            const orderId = order.orderId;
        
            const orderItems = cartItems.map(item => ({
                quantity: item.quantity,
                priceAtPurchase: item.price * item.quantity, 
                orderId: orderId,
                productId: item.productId
            }));
        
            await OrderItemService.addOrderItems(orderItems);

            res.status(201).send(order);
        } catch (error) {
            res.status(400).send(error.message);
        }
        
    }

    async update(req, res){
        try{
            const order = await orderService.update(req.params.id, req.body);
            res.status(200).send(order);
        }catch(error){
            res.status(400).send(error.message);
        }
    }

    async delete(req, res){
        try{
            const order = await orderService.delete(req.params.id);
            res.status(200).send(order);
        }catch(error){
            res.status(400).send(error.message);
        }
    }

    async getByUserId(req, res){
        try{
            const orders = await orderService.getByUserId(req.user.userId);
            res.status(200).send(orders);
        }catch(error){
            res.status(400).send(error.message);
        }
    }

    async payment(req, res){
        try{
            const isAuth = req.isAuthenticated();
            if (!isAuth) {
                return res.send("Not authenticated");
            }
            const orderData = {
                amount: req.body.total,
                orderId: req.body.orderId,
                message: ''
            };
        
            const response = await api.post(`/transfer`,orderData, {
                headers: {
                    Authorization: `Bearer ${req.user.paymentToken}`,
                },
            });

            if (response.status === 400) {
                return res.send(response.message);
            }

            res.send(response.data);
        }catch(error){
            res.status(400).send(error.message);
        }
    }
}

export default new OrderController();