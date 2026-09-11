const Post = require("../models/Post");
const User = require("../models/User");
const Notification = require("../models/Notification");
const {
  sendLikeEmail,
  sendCommentEmail,
  sendPostEmail,
} = require("../services/emailService");

// Create Post
const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    let image = "";

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const post = await Post.create({
      author: req.user.id,
      content,
      image,
    });

    const currentUser = await User.findById(req.user.id);

    if (currentUser && currentUser.followers?.length > 0) {
      const followers = await User.find({
        _id: { $in: currentUser.followers },
      }).select("email fullName");

      for (const follower of followers) {
        if (!follower.email) continue;

        try {
          await sendPostEmail({
            recipientEmail: follower.email,
            recipientName: follower.fullName,
            senderName: currentUser.fullName,
            postContent: content,
          });

          console.log("POST EMAIL SENT SUCCESSFULLY");
        } catch (emailError) {
          console.error("POST EMAIL FAILED:", emailError.message);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Create post error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "fullName username profilePicture")
      .populate("comments.user", "fullName username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Logged-in User Posts
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: req.user.id,
    })
      .populate(
        "author",
        "fullName username profilePicture"
      )
      .populate(
        "comments.user",
        "fullName username profilePicture"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Like / Unlike Post
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const userId = req.user.id;

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    // Unlike
    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );

      await post.save();

      return res.json({
        success: true,
        likes: post.likes.length,
        liked: false,
        post,
      });
    }

    // Like
    post.likes.push(userId);

    await post.save();

    // Don't notify yourself
    if (post.author.toString() !== userId.toString()) {
      const currentUser = await User.findById(userId);

      if (currentUser) {
        // Prevent duplicate notification for this like
        const existingNotification =
          await Notification.findOne({
            recipient: post.author,
            sender: userId,
            type: "like",
            post: post._id,
          });

        if (!existingNotification) {
  await Notification.create({
    recipient: post.author,
    sender: userId,
    type: "like",
    post: post._id,
    message: `${currentUser.fullName} liked your post`,
    isRead: false,
  });

  const postOwner = await User.findById(post.author);

  if (postOwner?.email) {
    try {
      await sendLikeEmail({
        recipientEmail: postOwner.email,
        recipientName: postOwner.fullName,
        senderName: currentUser.fullName,
      });

      console.log("LIKE EMAIL SENT SUCCESSFULLY");
    } catch (emailError) {
      console.error("LIKE EMAIL FAILED:", emailError.message);
    }
  }
}
      }
    }

    return res.json({
      success: true,
      likes: post.likes.length,
      liked: true,
      post,
    });
  } catch (error) {
    console.error("Like post error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add Comment
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.comments.push({
      user: req.user.id,
      text,
    });

    await post.save();
    
    if (post.author.toString() !== req.user.id) {
  const currentUser = await User.findById(req.user.id);

  if (currentUser) {
    await Notification.create({
      recipient: post.author,
      sender: req.user.id,
      type: "comment",
      post: post._id,
      message: `${currentUser.fullName} commented on your post`,
    });

    const postOwner = await User.findById(post.author);

    if (postOwner?.email) {
      try {
        await sendCommentEmail({
          recipientEmail: postOwner.email,
          recipientName: postOwner.fullName,
          senderName: currentUser.fullName,
          commentText: text,
        });

        console.log("COMMENT EMAIL SENT SUCCESSFULLY");
      } catch (emailError) {
        console.error("COMMENT EMAIL FAILED:", emailError.message);
      }
    }
  }
}

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comments: post.comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Comment
const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comments",
      });
    }

    comment.deleteOne();

    await post.save();

    res.json({
      success: true,
      message: "Comment deleted successfully",
      comments: post.comments,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Only the owner can delete the post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post",
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: req.params.id,
    })
      .populate(
        "author",
        "fullName username profilePicture"
      )
      .populate(
        "comments.user",
        "fullName username profilePicture"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      posts,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFeed = async (req, res) => {
  try {
    const User = require("../models/User");

    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userIds = [
      req.user.id,
      ...currentUser.following,
    ];

    const posts = await Post.find({
      author: { $in: userIds },
    })
      .populate(
        "author",
        "fullName username profilePicture"
      )
      .populate(
        "comments.user",
        "fullName username profilePicture"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Post
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate(
        "author",
        "fullName username profilePicture"
      )
      .populate(
        "comments.user",
        "fullName username profilePicture"
      );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("Get post error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getMyPosts,
  getUserPosts,
  getFeed,
  getPostById,
  likePost,
  addComment,
  deletePost,
  deleteComment,
};
