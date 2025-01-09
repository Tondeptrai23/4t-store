import { Op } from "sequelize";
import db from "../config/database.js";
import Transaction from "../models/transaction.js";
import User from "../models/user.js";
import {
    FilterBuilder,
    PaginationBuilder,
    SortBuilder,
} from "../utils/condition.js";

class TransactionController {
    async transfer(req, res) {
        const t = await db.transaction();

        try {
            const { amount } = req.body;
            const userId = req.user.id;

            // Validate amount
            if (!amount || amount <= 0) {
                return res.status(400).json({ message: "Invalid amount" });
            }

            // Get user and admin
            const user = await User.findByPk(userId, { transaction: t });
            const admin = await User.findOne({
                where: { isAdmin: true },
                transaction: t,
            });

            if (!user || !admin) {
                await t.rollback();
                return res
                    .status(404)
                    .json({ message: "User or admin not found" });
            }

            // Check balance
            if (user.balance < amount) {
                await t.rollback();
                return res
                    .status(400)
                    .json({ message: "Insufficient balance" });
            }

            // Create transaction record
            const transaction = await Transaction.create(
                {
                    fromUserId: userId,
                    toUserId: admin.id,
                    amount,
                    status: "pending",
                },
                { transaction: t }
            );

            // Small delay to simulate processing time
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Update balances
            await User.update(
                { balance: db.literal(`balance - ${amount}`) },
                { where: { id: userId }, transaction: t }
            );

            await User.update(
                { balance: db.literal(`balance + ${amount}`) },
                { where: { id: admin.id }, transaction: t }
            );

            // Update transaction status
            await Transaction.update(
                { status: "completed" },
                { where: { id: transaction.id }, transaction: t }
            );

            await t.commit();

            res.json({
                message: "Transfer successful",
                transactionId: transaction.id,
                newBalance: user.balance - amount,
            });
        } catch (error) {
            await t.rollback();
            res.status(500).json({ message: "Transfer failed" });
        }
    }

    async getTransactionHistory(req, res) {
        const filterBuilder = new TransactionFilterBuilder(req.query);
        const paginationBuilder = new PaginationBuilder(req.query);
        const sortBuilder = new TransactionSortBuilder(req.query);

        // Add user condition (always filter by current user)
        const userCondition = {
            [Op.or]: [{ fromUserId: req.user.id }, { toUserId: req.user.id }],
        };

        // Combine all conditions
        const conditions = {
            [Op.and]: [userCondition, ...filterBuilder.build()],
        };

        const count = await Transaction.count({ where: conditions });

        // Get pagination and sort
        const { limit, offset } = paginationBuilder.build();
        const order = sortBuilder.build();

        const transactions = await Transaction.findAll({
            where: conditions,
            order,
            limit,
            offset,
        });

        res.json({
            transactions: transactions,
            totalItems: count,
            currentPage: Math.floor(offset / limit) + 1,
            totalPages: Math.ceil(count / limit),
        });
    }

    async getAdminBalance(req, res) {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied" });
        }

        const admin = await User.findOne({
            where: { isAdmin: true },
            attributes: ["balance"],
        });

        res.json({ success: true, balance: admin.balance });
    }
}

export class TransactionFilterBuilder extends FilterBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._allowFields = ["status", "fromUserId", "toUserId", "createdAt"];
    }
}

export class TransactionSortBuilder extends SortBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._map = {
            amount: ["amount"],
            createdAt: ["createdAt"],
            status: ["status"],
        };
        this._defaultSort = [["createdAt", "DESC"]];
    }
}

export default new TransactionController();
