const Task = require('../models/task.model');

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { taskId } = req.params;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.comments.push({
      userId: req.user.id,
      text,
    });

    await task.save();

    res.status(200).json({
      message: "Comment added successfully",
      task,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};