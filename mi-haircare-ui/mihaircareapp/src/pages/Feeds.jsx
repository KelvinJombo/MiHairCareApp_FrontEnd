import React, { useEffect, useState } from "react";
import apiClient from "../api/client";

const Feeds = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      const response = await apiClient.get("/user/feed");

      setPosts(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="feed-page">
      <h2>Hair Community Feed</h2>

      {posts.map((post) => (
        <div key={post.id} className="feed-card">
          <div className="feed-header">
            <img src={post.profilePicture} alt="" className="profile-pic" />

            <div>
              <h4>{post.userName}</h4>
              <small>{new Date(post.createdAt).toLocaleDateString()}</small>
            </div>
          </div>

          <h3>{post.hairStyleName}</h3>

          <p>{post.caption}</p>

          <p>
            <strong>Mood:</strong> {post.mood}
          </p>

          {post.photos?.map((photo) => (
            <img key={photo.id} src={photo.url} alt="" className="feed-image" />
          ))}

          <div className="feed-actions">
            ❤️ {post.likesCount}
            &nbsp;&nbsp; 💬 {post.commentsCount}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feeds;
