import { Router } from "express";
import { MongoDBChats } from "../daos/mongo/MongoDBChats.js";

const router = Router();
const chatDB = new MongoDBChats();

router.get("/", async (req, res) => {
  try {
    res.render("chat");
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.post("/new-message", async (req, res) => {
  try {
    const message = req.body;
    const createdMessage = await chatDB.create(message);

      // emite new messeage 
    req.app.io.emit("new-message", createdMessage);

    res.status(201).json({
      status: "success",
      payload: createdMessage,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.get("/messages", async (req, res) => {
  try {
    const messages = await chatDB.getAll();
    res.status(200).json({
      status: "success",
      payload: messages,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

export default router;
