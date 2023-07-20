import MongoClass from "./MongoClass.js";
import { messagesSchema } from "./models/MessagesSchema.js";

export default new MongoClass("messages", messagesSchema);