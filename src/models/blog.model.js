import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({}, { timestamps: true });

export default Blog = mongoose.model("Blog", blogSchema);
