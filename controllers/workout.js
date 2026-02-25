const Workout = require("../models/Workout");
const mongoose = require("mongoose");
const { verify, errorHandler } = require("../auth");

module.exports.addWorkout = (req, res) => {
  let newWorkout = new Workout({
    userId: req.user.id,
    name: req.body.name,
    duration: req.body.duration,
  });

  return newWorkout
    .save()
    .then((workout) => res.status(201).send(workout))
    .catch((error) => errorHandler(error, req, res));
};

module.exports.getWorkout = (req, res) => {
  return Workout.find({ userId: req.user.id })
    .then((result) => {
      if (result.length === 0) {
        return res.status(400).send({ message: "No workouts found" });
      } else {
        return res.status(200).send({
          workouts: result,
        });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

module.exports.updateWorkout = (req, res) => {
  let updateWorkout = {
    name: req.body.name,
    duration: req.body.duration,
  };

  return Workout.findByIdAndUpdate(req.params.id, updateWorkout).then(
    (result) =>
      res
        .status(200)
        .send({
          message: "Workout updated successfully",
          updatedWorkout: result,
        })
      )
      .catch((error) => errorHandler(error, req, res))
};

module.exports.deleteWorkout = (req, res) => {
  return Workout.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (!result) {
        return res.status(404).send({ message: "Workout not found" });
      }
      return res.status(200).send({ message: "Workout deleted successfully" });
    })
    .catch((error) => errorHandler(error, req, res));
};

module.exports.completWorkout = (req, res) => {
  return Workout.findByIdAndUpdate(req.params.id, { status: "Completed" }, {new: true})
    .then((result) => res.status(200).send({message: "Workout status updated successfully", updatedWorkout: result}))
    .catch((error) => errorHandler(error, req, res));
};
