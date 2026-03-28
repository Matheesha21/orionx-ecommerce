import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  chunk_index: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Document = mongoose.model("Document", documentSchema);
export default Document;
