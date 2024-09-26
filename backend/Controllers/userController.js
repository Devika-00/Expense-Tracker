import User from "../Models/user.js";
import CustomError from "../utils/CustomError.js";
import bcrypt from "bcrypt";
import generateTokens from "../utils/GenerateTokens.js";
import Budget from "../Models/Budget.js";
import Transaction from "../Models/TransactionHistory.js";
import mongoose from "mongoose";

//Method POST - Register User
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      throw new CustomError("Email already exists", 401);
    }
    await User.create({ name: username, email: email, password: password });
    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

//method POST - Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isEmailExist = await User.findOne({ email });
    if (!isEmailExist) {
      throw new CustomError("Invalid credentials", 401);
    }
    const isPasswordMatch = await bcrypt.compare(
      password,
      isEmailExist.password
    );
    if (!isPasswordMatch) throw new CustomError("Invalid credentials", 401);
    const payload = {
      id: isEmailExist._id,
      name: isEmailExist.name,
      email: isEmailExist.email,
    };
    const { access_token } = generateTokens(payload);
    console.log(access_token);

    return res.status(200).json({
      success: true,
      message: "User LoggedIn successfully",
      access_token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

//method post Add newbudget
export const addNewBudget = async (req, res) => {
  console.log(req.body);
  const { userId, category, amount, month } = req.body;

  if (!userId || !category || amount == null || !month) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newBudget = new Budget({ userId, category, amount, month });
    const savedBudget = await newBudget.save();
    res.status(201).json(savedBudget);
  } catch (error) {
    console.error("Error adding budget:", error);
    res.status(500).json({ message: "Error adding budget" });
  }
};

// Method GET - Get Budgets by User ID
export const getBudgetsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const budgets = await Budget.find({ userId });
    res.status(200).json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Method PUT - Update Budget Amount
export const updateBudgetAmount = async (req, res) => {
  const { categoryId } = req.params;
  const { amount } = req.body;

  if (amount <= 0) {
    return res.status(400).json({ message: "Amount must be greater than 0" });
  }

  try {
    const budget = await Budget.findById(categoryId);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    if (budget.amount < budget.amountUsed + amount) {
      return res.status(400).json({ message: "Insufficient budget amount" });
    }

    budget.amountUsed += amount;

    const updatedBudget = await budget.save();
    res.status(200).json(updatedBudget);
  } catch (error) {
    console.error("Error updating budget amount:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Method POST - Add New Expense
export const addNewExpense = async (req, res) => {
  const { userId, category, amount, date, description } = req.body;

  if (!userId || !category || amount == null || !date || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newExpense = new Transaction({
      userId,
      category,
      amount,
      date,
      description,
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Error adding expense" });
  }
};

// Method GET - Fetch Transaction History by User ID
export const getTransactionHistoryByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, category } = req.query;

    const query = { userId };

    // Apply filters only if they exist
    if (startDate) {
      query.date = { $gte: new Date(startDate) };
    }
    if (endDate) {
      if (!query.date) query.date = {};
      query.date.$lte = new Date(endDate);
    }
    if (category && category !== "All") {
      query.category = category;
    }

    // Fetch the transactions from the database
    const transactions = await Transaction.find(query).sort({ date: -1 });

    // Return the fetched transactions
    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ message: "Error fetching transactions" });
  }
};

// Method DELETE - Delete Budget by ID
export const deleteBudget = async (req, res) => {
  const { categoryId } = req.params; // Get category ID from URL

  try {
    // Find the budget entry by ID and delete it
    const deletedBudget = await Budget.findByIdAndDelete(categoryId);
    if (!deletedBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    // Return success response
    res
      .status(200)
      .json({ message: "Budget deleted successfully", deletedBudget });
  } catch (error) {
    console.error("Error deleting budget:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Method PUT - Update Budget Details
export const updateBudgetDetails = async (req, res) => {
  const { budgetId } = req.params;
  const { category, amount, amountUsed, date } = req.body;

  try {
    // Find the budget entry by ID
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    // Update budget details
    budget.category = category || budget.category;
    budget.amount = amount !== undefined ? amount : budget.amount;
    budget.amountUsed =
      amountUsed !== undefined ? amountUsed : budget.amountUsed;
    budget.date = date || budget.date;

    // Save the updated budget
    const updatedBudget = await budget.save();
    res.status(200).json({ message: "Updated Succesfully" }, updatedBudget);
  } catch (error) {
    console.error("Error updating budget details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getDailyExpensesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    const dailyExpenses = await Transaction.aggregate([
      { $match: { userId: objectIdUserId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedExpenses = dailyExpenses.map((expense) => ({
      date: expense._id,
      amount: expense.totalAmount,
    }));

    return res.status(200).json(formattedExpenses);
  } catch (error) {
    console.error("Error fetching daily expenses:", error);
    return res.status(500).json({ message: "Error fetching daily expenses" });
  }
};
