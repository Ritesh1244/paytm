const { Account } = require('../Models/paytm'); // Ensure path is correct
const { default: mongoose } = require('mongoose');

const allbalances = async (req, res) => {
    try {
        console.log(req.userId)
        const account = await Account.findOne({ user: req.userId });
        
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.json({ balance: account.balance });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const transfer = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { amount, to } = req.body;

    try {
        // Parse amount to ensure it's a number
        const transferAmount = parseFloat(amount);

        // Check sender's balance
        const sender = await Account.findOne({ user: req.userId }).session(session);
        if (!sender || sender.balance < transferAmount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient Balance" });
        }

        // Check receiver's account
        const receiver = await Account.findOne({ user: to }).session(session);
        if (!receiver) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Invalid Account" });
        }

        // Perform the transfer
        sender.balance -= transferAmount;
        receiver.balance += transferAmount;

        // Save both accounts with the session
        await sender.save({ session });
        await receiver.save({ session });

        await session.commitTransaction();
        res.json({ message: "Transfer Successful" });

    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Server error", error: error.message });
    } finally {
        session.endSession();
    }
};

module.exports = {allbalances,transfer}
