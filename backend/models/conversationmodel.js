import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensure every conversation has participants
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: [],
    },
  ],
  lastMessage: {
    type: String,
    default: "",
  },
}, { timestamps: true }); // This adds 'createdAt' and 'updatedAt' automatically

// Add a pre-save hook to ensure the conversation has at least two participants
conversationSchema.pre("save", function (next) {
  if (this.participants.length < 2) {
    return next(new Error("A conversation must have at least two participants"));
  }
  next();
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;






// import mongoose from "mongoose";

// const conversationSchema = new mongoose.Schema({
//     participants:[
//         {
//             type:mongoose.Schema.Types.ObjectId,
//             ref: "User",
//         },
//     ],
//     messages:[
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Message",
//             default:[],
//         },
//     ],
// },{timestamps:true});

// const Conversation = mongoose.model("Conversation",conversationSchema);

// export default Conversation;