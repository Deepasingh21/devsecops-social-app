import API_URL from "./api";

export const getPosts = async () => {
  const token = localStorage.getItem("token");


  const response = await fetch(`${API_URL}/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const createPost = async (postData) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();

  formData.append("content", postData.content);

  if (postData.image) {
    formData.append("postImage", postData.image);
  }

  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
};

export const likePost = async (postId) => {
  const token = localStorage.getItem("token");


  const response = await fetch(`${API_URL}/posts/${postId}/like`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const addComment = async (postId, text) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/posts/${postId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });

  return response.json();
};

export const deletePost = async (postId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const deleteComment = async (postId, commentId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/posts/${postId}/comment/${commentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};

export const getMyPosts = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/posts/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const getUserPosts = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/posts/user/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};

export const getFeed = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/posts/feed`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const getPostById = async (postId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/posts/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};
