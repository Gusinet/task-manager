import  express  from "express";
import { Task } from "../models/task.js";
import { userRouter } from "./user.js";
export const taskRouter = new express.Router()



taskRouter.post("/task", async (req, res) => {
    const task = new Task(req.body);
  
    try {
      await task.save();
      res.status(201).send(task);
    } catch (e) {
      res.status(500).send(e);
    }
});
  
taskRouter.get("/task", async (req, res) => {
    try {
      const tasks = await Task.find({});
      res.status(201).send(tasks);
    } catch (e) {
      res.status(500).send(e);
    }
});
  
taskRouter.get("/task/:id", async (req, res) => {
    const _id = req.params.id;
  
    try {
      const task = await Task.findById(_id);
      if (!task) {
        res.status(404).res;
      }
      res.send(task);
    } catch (e) {
      res.status(500).send();
    }
});
  
taskRouter.patch("/task/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });
  
    if (!isValidOperation) {
      return res.status(400).send({ error: "invalide update" });
    }
  
    try {
      const task = await Task.findById(req.params.id);

      updates.forEach((update) => (task[update] = req.body[update]))
      await task.save()

      if (!task) {
        return res.status(404).send();
      }
      res.send(task);
    } catch (e) {
      res.status(400).send();
    }
});
  
taskRouter.delete("/task/:id", async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
  
      if (!task) {
        return res.status(404).send();
      }
      res.send(task);
    } catch (e) {
      res.status(500).send();
    }
});