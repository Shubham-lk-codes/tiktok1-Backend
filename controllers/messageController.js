// controllers/messageController.js
import Message from '../models/Message.model.js';

export const sendMessage = async (req, res) => {
  const { conversationId, text } = req.body;

  try {
    const message = new Message({
      conversationId,
      sender: req.user._id,
      text,
    });
    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId }).populate('sender', 'name');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
