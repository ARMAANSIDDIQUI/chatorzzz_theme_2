const SupportTicket = require('../models/SupportTicket');

exports.sendMessage = async (req, res) => {
  try {
    const { content, userId } = req.body;
    const sender = req.user.role === 'admin' ? 'admin' : 'user';
    const targetUserId = req.user.role === 'admin' ? userId : req.user._id;

    let ticket = await SupportTicket.findOne({ user: targetUserId, isActive: true });
    
    if (!ticket) {
      ticket = await SupportTicket.create({ user: targetUserId, messages: [] });
    }

    ticket.messages.push({ sender, content });
    await ticket.save();

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({ user: req.user._id, isActive: true });
    res.json(ticket || { messages: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ isActive: true }).populate('user', 'name email');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.messages.forEach(msg => {
      if (msg.sender === 'user') msg.status = 'read';
    });
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
