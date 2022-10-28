import  express  from "express";
import { auth } from "../middleware/auth.js";
import { Task } from "../models/task.js";
export const taskRouter = new express.Router()



taskRouter.post("/task",auth, async (req, res) => {
    const task = new Task({
      ...req.body,
      owner: req.user._id
    })
  
    try {
      await task.save();
      res.status(201).send(task);
    } catch (e) {
      res.status(500).send(e);
    }
});
  
taskRouter.get("/task", auth, async (req, res) => {
    try {
      const tasks = await Task.find({ owner: req.user._id });
      res.status(201).send(tasks);
    } catch (e) {
      res.status(500).send(e);
    }
});
  
taskRouter.get("/task/:id", auth, async (req, res) => {
    const _id = req.params.id;
  
    try {
      const task = await Task.findOne({ _id, owner: req.user._id })
      if (!task) {
        res.status(404).res;
      }
      res.send(task);
    } catch (e) {
      res.status(500).send();
    }
});
  
taskRouter.patch("/task/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });
  
    if (!isValidOperation) {
      return res.status(400).send({ error: "invalide update" });
    }
  
    try {
      const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

      if (!task) {
        return res.status(404).send();
      }

      updates.forEach((update) => (task[update] = req.body[update]))
      await task.save()

      res.send(task);
    } catch (e) {
      res.status(400).send();
    }
});
  
taskRouter.delete("/task/:id",auth, async (req, res) => {
    try {
      const task = await Task.findOneAndDelete( { _id: req.params.id, owner: req.user._id } );
  
      if (!task) {
        return res.status(404).send();
      }
      res.send(task);
    } catch (e) {
      res.status(500).send();
    }
});