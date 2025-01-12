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
            const { amount, message, orderId } = req.body;
            const userId = req.user.id;

            // Validate amount
            if (!amount || amount <= 0) {
                return res
                    .status(400)
                    .json({ success: false, message: "Invalid amount" });
            }

            // Get user and admin
            const user = await User.findByPk(userId, { transaction: t });
            const admin = await User.findOne({
                where: { isAdmin: true },
                transaction: t,
            });

            if (!user || !admin) {
                await t.rollback();
                return res.status(404).json({
                    success: false,
                    message: "User or admin not found",
                });
            }

            // Check balance
            if (user.balance < amount) {
                await t.rollback();
                return res
                    .status(400)
                    .json({ success: false, message: "Insufficient balance" });
            }

            // Create transaction record
            const transaction = await Transaction.create(
                {
                    fromUserId: userId,
                    toUserId: admin.id,
                    amount,
                    status: "pending",
                    message,
                    orderId,
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
            throw error;
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

    async getBalance(req, res) {
        const user = await User.findOne({
            where: {
                id: req.user.id,
            },
            attributes: ["balance"],
        });

        res.json({ success: true, balance: user.balance });
    }

    async getUserStatistics(req, res) {
        const totalUsers = await User.count({
            where: { isAdmin: false },
        });

        const totalBalance = await User.sum("balance", {
            where: { isAdmin: false },
        });

        const newUsersToday = await User.count({
            where: {
                isAdmin: false,
                createdAt: {
                    [Op.gte]: new Date().setHours(0, 0, 0, 0),
                },
            },
        });

        res.json({
            totalUsers,
            totalBalance,
            newUsersToday,
            averageBalance: totalBalance / totalUsers,
        });
    }

    async getTransactionStatistics(req, res) {
        const totalTransactions = await Transaction.count();

        const totalAmount = await Transaction.sum("amount");

        const pendingTransactions = await Transaction.count({
            where: { status: "pending" },
        });

        const completedTransactions = await Transaction.count({
            where: { status: "completed" },
        });

        res.json({
            totalTransactions,
            totalAmount,
            pendingTransactions,
            completedTransactions,
        });
    }

    async getBalanceStatistics(req, res) {
        const adminBalance = await User.findOne({
            where: { isAdmin: true },
            attributes: ["balance"],
        });

        const userBalances = await User.findAll({
            where: { isAdmin: false },
            attributes: [
                [
                    sequelize.fn("SUM", sequelize.col("balance")),
                    "totalUserBalance",
                ],
                [
                    sequelize.fn("AVG", sequelize.col("balance")),
                    "averageBalance",
                ],
                [sequelize.fn("MAX", sequelize.col("balance")), "maxBalance"],
                [sequelize.fn("MIN", sequelize.col("balance")), "minBalance"],
            ],
        });

        res.json({
            adminBalance: adminBalance.balance,
            userBalances: userBalances[0],
            totalSystemBalance:
                adminBalance.balance + userBalances[0].totalUserBalance,
        });
    }
}

export class TransactionFilterBuilder extends FilterBuilder {
    constructor(requestQuery) {
        super(requestQuery);
        this._allowFields = [
            "status",
            "fromUserId",
            "toUserId",
            "createdAt",
            "updatedAt",
            "amount",
            "orderId",
        ];
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
