import User from "../models/user.model.js";

export const findUser = async (req, res) => {
  const { query, searcherId } = req.query;

  try {
    if (!query || !searcherId) return res.json([]); 

    const searcher = await User.findById(searcherId);
    if (!searcher) return res.status(404).json({ message: "User not found" });

    const searcherFriends = searcher.friends;
    const users = await User.find({
      _id: { $ne: searcherId, $nin: searcherFriends },
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const handleMessageClick = async (req, res) => {
  const { receiverId, senderId } = req.body;

  try {
    if (!receiverId || !senderId) {
      return res.status(400).json({ msg: "Sender and receiver ID are required!" });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    if (sender.friends.includes(receiverId)) {
      return res.status(400).json({ message: "Already friends" });
    }

    sender.friends.push(receiverId);
    receiver.friends.push(senderId);

    await sender.save();
    await receiver.save();
    res.status(200).json(receiver);

  } catch (err) {
   
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
