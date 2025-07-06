const jwt = require('jsonwebtoken');

module.exports = (io) => {
  // Authentication middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[SOCKET] User connected: ${socket.userId}, Socket ID: ${socket.id}`);

    // Join personal room for multi-device sync
    socket.join(socket.userId);
    console.log(`[SOCKET] User ${socket.userId} joined personal room: ${socket.userId}`);

    // (Optional: legacy support, can be removed if not needed)
    socket.on('joinRoom', ({ userId, otherUserId }) => {
      if (!userId || !otherUserId) {
        console.log('[SOCKET] joinRoom called with missing userId/otherUserId');
        return;
      }
      const room = [userId, otherUserId].sort().join('-');
      socket.join(room);
      console.log(`[SOCKET] User ${userId} joined legacy room: ${room}`);
    });

    socket.on('privateMessage', async ({ sender, receiver, content }) => {
      if (socket.userId !== sender) return;
      const messageData = { sender, receiver, content, createdAt: new Date() };
      // Multi-device sync: send to all sender and receiver devices
      io.to(sender).emit('privateMessage', messageData);
      io.to(receiver).emit('privateMessage', messageData);
      console.log(`[SOCKET] Message from ${sender} to ${receiver} sent to rooms: ${sender}, ${receiver}`);
    });

    socket.on('disconnect', () => {
      console.log(`[SOCKET] User disconnected: ${socket.userId}, Socket ID: ${socket.id}`);
    });
  });
};