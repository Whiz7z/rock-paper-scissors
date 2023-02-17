const express = require("express");
const HttpError = require("../models/http-error");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateForm = require("../controllers/validateForm");
const router = express.Router();
const User = require("../models/user");

router.post("/login", async (req, res, next) => {
  validateForm(req, res);

  const { username, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ name: username });
  } catch (err) {
    const error = new HttpError("Ligging in failed, try later", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "invalid credentials, could not log you in,",
      403
    );

    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "invalid credentials, could not log you in,",
      500
    );

    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "invalid credentials, could not log you in,",
      401
    );

    return next(error);
  }

  let token;

  try {
    token = jwt.sign(
      { userId: existingUser.id, name: existingUser.name },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Logging in failed, try again", 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    name: existingUser.name,
    token: token,
  });
});

router.post("/signup", async (req, res, next) => {
  validateForm(req, res);
  const { username, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ name: username });
  } catch (err) {
    const error = new HttpError("Singing up failed, try later", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login insted.",
      422
    );

    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not create user, please try again", 500);
    return next(error);
  }

  const createdUser = new User({
    name: username,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Creating a user failed, try again", 500);
    return next(error);
  }

  let token;

  try {
    token = jwt.sign(
      { userId: createdUser.id, name: createdUser.name },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Creating a user failed, try again", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, name: createdUser.name, token: token });
});
module.exports = router;
