import ErrorHandler from "../middlewares/error.js";
import { Task } from "../models/task.js";

export const newTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    await Task.create({
      title,
      description,
      user: req.user,
    });

    res.status(200).json({
      success: true,
      message: "Task added successfully",
    });
  } catch (error) {
    next(error);
  }
};

// get the list of tasks for the logged in user
export const getMyTasks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({ user: userId });
    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

//update if task is completed or not
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return next(new ErrorHandler("Task Not Found", 404));
    task.isCompleted = !task.isCompleted;
    await task.save();
    res.status(200).json({
      success: true,
      message: "Succesfully Updated!",
    });
  } catch (error) {
    next(error);
  }
};

// remove or delete the task from the list
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return next(new ErrorHandler("Task Not Found", 404));
    await task.deleteOne(); // works on a document instance
    res.status(200).json({
      success: true,
      message: "Succesfully Deleted!",
    });
  } catch (error) {
    next(error);
  }
};
