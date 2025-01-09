import db from "../config/database.js";
import Transaction from "../models/transaction.js";
import User from "../models/user.js";

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
            await new Promise((resolve) => setTimeout(resolve, 2000));

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
}

export default new TransactionController();
