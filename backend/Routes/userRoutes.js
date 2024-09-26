import { Router } from "express";
const route = Router();
import { 
    registerUser, 
    loginUser, 
    addNewBudget, 
    getBudgetsByUserId,
    updateBudgetAmount,
    addNewExpense,
    getTransactionHistoryByUserId,
    deleteBudget,
    updateBudgetDetails,
    getDailyExpensesByUserId,
} from "../Controllers/userController.js";

// User routes
route.post("/register", registerUser);
route.post("/login", loginUser);

// Budget routes
route.post("/budget", addNewBudget);
route.get("/budget/:userId", getBudgetsByUserId);
route.put("/budget/:categoryId", updateBudgetAmount); 
route.put("/budgetDetails/:budgetId", updateBudgetDetails);
route.delete("/budget/:categoryId", deleteBudget); 

// Expense routes
route.post("/expense", addNewExpense); 

// Transaction history routes
route.get('/transactions/:userId', getTransactionHistoryByUserId);

route.get('/expenses/daily/:userId', getDailyExpensesByUserId);

export default route;
