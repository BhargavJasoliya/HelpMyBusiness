import express from "express";
import {
  getProducts,
  getCustomers,
  getTransactions,
  getGeography,
  registerUser,
  loginUser,
  logoutUser,
  addProduct
} from "../controllers/client.js";

const router = express.Router();

router.get("/products", getProducts);
router.post("/addProduct", addProduct);
router.get("/customers", getCustomers);
router.get("/transactions", getTransactions);
router.get("/geography", getGeography);
router.post("/registerUser", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
export default router;
