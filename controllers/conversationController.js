import Conversation from '../models/conversation.model.js';
import Message from "../models/Message.model.js"

export const createConversation = async (req, res) => {
  const { recipientId, message } = req.body;

  if (!message || !recipientId) {
    return res.status(400).json({ message: 'Recipient and initial message are required' });
  }

  try {
    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] },
    });

    if (!conversation) {
      // Create a new conversation if none exists
      conversation = new Conversation({
        participants: [req.user._id, recipientId],
        messages: [],
      });
      await conversation.save();
    }

    // Create a new message
    const newMessage = new Message({
      conversationId: conversation._id,
      sender: req.user._id,
      text: message,
    });

    const savedMessage = await newMessage.save();

    // Add the message to the conversation
    conversation.messages.push(savedMessage._id);
    await conversation.save();

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// export const createConversation = async (req, res) => {
//   const { participants, message } = req.body;

//   if (!message || !participants || participants.length !== 2) {
//     return res.status(400).json({ message: 'Participants and initial message are required' });
//   }

//   try {
//     // Create the conversation first
//     const conversation = new Conversation({
//       participants,
//       messages: [], // Start with an empty messages array
//     });

//     const savedConversation = await conversation.save();

//     // Create a new message document with the correct conversationId
//     const newMessage = new Message({
//       conversationId: savedConversation._id,  // Set the conversationId to the newly saved conversation
//       sender: req.user._id,  // Sender is the authenticated user
//       text: message,
//     });

//     // Save the message to the database
//     const savedMessage = await newMessage.save();

//     // Add the message ObjectId to the conversation's messages array
//     savedConversation.messages.push(savedMessage._id);
//     await savedConversation.save();

//     // Respond with the saved conversation and message
//     res.status(201).json(savedConversation);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id }).populate('participants', 'name');
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};