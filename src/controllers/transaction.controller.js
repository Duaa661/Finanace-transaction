const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/legerModel")
const accountModel=require("../models/account.model")
const emailService=require("../services/email.service")
const mongoose=require("mongoose")
const sendTransactiontoEmail=require("../services/email.service")


/**
 * - create a new transaction
 * - 10 step transfer flow
 * - 1. Validate request
 * - 2.Validate Idempotency key
 * - 3.Check account status
 * - 4.Derive sender balance from ledger
 * - 5. Create transaction(PENDING)
 * - 6.Credit DEBIT ledger entry
 * - 7. Create CREDIT ledger entry
 * - 8. Mark transaction COMPLETED
 * - 9. Commit MONGODB Section
 * - 10.Send email notification
 */




async function createTransaction(req, res) {
    /**
     * 1.Validate request
     */
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message:"FromAccount, toAccount, amount and idempotencyKey are required"
        })
    }
    const fromUserAccount = await accountModel.findOne({ _id: fromAccount });
    const toUserAccount = await accountModel.finOne({ _id: toAccount })
    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({
            message:"Invalid fromAccount to toAccount"
        })
    }
    /**
     * 2.Validate Idempotency key
     */
    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey:idempotencyKey
    })
    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction Already processed",
                transaction:isTransactionAlreadyExists
            })
        }
        if (isTransactionAlreadyExists.status === "PENDING") {
            return res.status(200).json({
                message:"Transaction is still processing"
            })
        }
        
        if (isTransactionAlreadyExists.status === "FAILED") {
            return res.status(500).json({
                message:"Transaction processing failed previously, please retry"
            })
        }
        
        if (isTransactionAlreadyExists.status === "REVERSED") {
            return res.status(500).json({
                message:"Transaction was reversed, please retry"
            })
        }
    }
    /**
     *  3.Current status 
     * */ 
    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
         message:"Both fromAccount and toAccount must be Active to process transaction"
     })
    }   
    
    /** 
     * 4. Derive sender balance from ledger
     */
    const balance = await fromUserAccount.getBalance()
    if (balance < amount) {
        return res.status(400).json({
            message:`Insufficent balance. Current balance is ${balance}. Requested amount is ${amount}`
        })
    }
    let transaction;
    try {

        /**
         * 5. Create transaction (PENDING)
         */
        // Start Session
        const session = await mongoose.startSession();
        session.startTransaction()

         transaction = (await transactionModel.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        }], { session }))[0]
    
        const debitLedgerEntry = await ledgerModel.create([{
            account: fromAccount,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT",
        }], { session })
    
        await (() => {
            return new Promise((resolve) => setTimeout(resolve, 15 * 1000))
        })()
    
        const creditLedgerEntry = await ledgerModel.create([{
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT",
        }], { session })
    
        await transactionModel.findOneAndUpdate(
            { _id: transaction._id },
            { status: "COMPLETED" },
            { session }
        )
        await transaction.save({ session })
    
        await session.commitTransaction()
        session.endSession()
        // end Session
    } catch (error) {
        return res.status(400).json({
            message:"Transaction is pending due to some issue, please retyr after sometime"
        })
    }

    /**
     * 10.Send email notification
     **/
    
    await emailService.sendTransactiontoEmail(req.user.email, req.user.name, amount, toAccount._id)
    return res.status(201).json({
        message: "Transaction Completed Sucessfully",
            transaction:transaction
    })
}

async function createIntialFundTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body;
    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message:"toAccount, amount and idompotencyKey are Required"
        })
    }
    const toUserAccount = await accountModel.findOne({
        _id:toAccount,
    })

    if (!toUserAccount) {
        return res.status(400).json({
            message:"Invalid toAccount"
        })
    }
    // find system user account
    const FromUserAccount = await accountModel.findOne({
        user: req.user._id
    })
    if (!FromUserAccount) {
        return res.status(400).json( {
            message:"System user account not found"
        })
    }
    const session = await mongoose.startSession()
    session.startTransaction()
    const transaction = new transactionModel({
        fromAccount: FromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    })
    
    const debitLedgerEntry = await mongoose.ledgerModel.create([{
        account: FromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type:"DEBIT"
    }], { session })
    
    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT",
    }], { session })
    
    transaction.status = "COMPLETED"
    await transaction.save({ session })
    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message: "Intial funds transaction completed sucessfully",
        transaction:transaction
    })
}
module.exports = {
    createTransaction,
    createIntialFundTransaction
}