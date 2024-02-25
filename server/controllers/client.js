import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import getCountryIso3 from "country-iso-2-to-3";
// import * as jwt from 'jsonwebtoken';
// const { sign, decode, verify } = jsonwebtoken;
// import ErrorHandler from "../utils/errorHandler.js";
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        });
        return {
          ...product._doc,
          stat,
        };
      })
    );

    res.status(200).json(productsWithStats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const addProduct = async (req, res) => {
  try {
    const { name, price, description, category, rating, supply } = req.body;
    console.log('Add Product ', req.body.category);

    const product = await Product.create(req.body);

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    // sort should look like this: { "field": "userId", "sort": "desc"}
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    // formatted sort should look like { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
      };

      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    const transactions = await Transaction.find({
      $or: [
        { cost: { $regex: new RegExp(search, "i") } },
        { userId: { $regex: new RegExp(search, "i") } },
      ],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

    const total = await Transaction.countDocuments({
      name: { $regex: search, $options: "i" },
    });

    res.status(200).json({
      transactions,
      total,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGeography = async (req, res) => {
  try {
    const users = await User.find();

    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryIso3(country);
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      return acc;
    }, {});

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );

    res.status(200).json(formattedLocations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};



//SignUp Route
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Req.body : ', req.body.name, req.body.email, req.body.password);
  const user = await User.create({
    name, email, password
  });
  console.log('User Created ', user);
  // const token = user.getJWTToken();

  // res.cookie("token", token, { maxAge: 1000 * 60 * 10, httpOnly: false });

  res.status(201).json({
    success: true,
    user,
    // token
  });
}

//Login Route
export const loginUser = async (req, res) => {
  console.log("LoginUser API");
  const { email, password } = req.body;
  // console.log('req.body', req.body);
  // console.log('Req. body ', email, password);
  const user = await User.findOne({ email });
  console.log('User found ', user);
  console.log('User pass ', user?.password);
  const mpass = user?.password.toString();
  const fpass = password.toString();
  console.log('Mpass Fpass ', mpass, fpass);
  if (mpass == fpass) {

    res.status(200).json({
      message: `Hello ${email} Login Successfully `,
      success: true,
      user,
      // token,
    });
  }
  else {
    console.log("Invalid email or password");
    res.status(201).json({
      message: "Invalid email or password",
    })
  }


}
//Logout User
export const logoutUser = async (req, res) => {
  // res.cookie("token", null, {
  //   expires: new Date(Date.now()),
  //   httpOnly: true,
  // });
  console.log("Logout User");
  try {
    res.status(202).json({
      success: true,
      message: "Logged Out Successfully",
    });

  }
  catch (error) {
    res.status(404).json({ message: error.message });
  }
}


export const getProduct = async (req, res) => {
  try {
    const products = await Product.find();

    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        });
        return {
          ...product._doc,
          stat,
        };
      })
    );

    res.status(200).json(productsWithStats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
