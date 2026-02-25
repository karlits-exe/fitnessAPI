const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { errorHandler, createAccessToken } = require("../auth");

module.exports.register = (req, res) => {
  let newUser = new User({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 12),
  });

  return newUser
    .save()
    .then((result) =>
      res.status(201).send({ message: "Registered Successfully" }),
    )
    .catch((error) => errorHandler(error, req, res));
};

module.exports.login = (req, res) => {
  if (req.body.email.includes("@")) {
    return User.findOne({ email: req.body.email })
      .then((result) => {
        if (!result) {
          return res.status(404).send({ message: "No email found" });
        } else {
          const isPasswordCorrect = bcrypt.compareSync(
            req.body.password,
            result.password,
          );
          if (isPasswordCorrect) {
            //Send status 200
            return res.status(200).send({
              access: createAccessToken(result),
            });
          } else {
            //Send status 401
            return res
              .status(401)
              .send({ message: "Incorrect email or password" });
          }
        }
      })
      .catch((error) => errorHandler(error, req, res));
  } else {
    return res.status(400).send({ message: "Invalid email format" });
  }
};

module.exports.details = (req, res) => {
  return User.findById(req.user.id)
    .select("-password")
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((error) => errorHandler(error, req, res));
};
