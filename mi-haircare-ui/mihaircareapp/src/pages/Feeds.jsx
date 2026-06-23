import React, { useCallback, useEffect, useState } from "react";
import apiClient from "../api/client";
import { useAuth } from "../Context/AuthContext";
import BannerImage1 from "../components/assets/images/SocialsBanner.jpeg";
import BannerImage2 from "../components/assets/images/SocialsBanner1.jpeg";
import BannerImage3 from "../components/assets/images/SocialsBanner2.jpeg";
import showToast from "../utils/toast";
import "./CSS/Feeds.css";

const Feeds = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("social");
  const [posts, setPosts] = useState([]);
  const [journals, setJournals] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [postForm, setPostForm] = useState({
    hairStyleName: "",
    caption: "",
    mood: "",
    beforeImage: null,
    afterImage: null,
  });

  const [journalForm, setJournalForm] = useState({
    title: "",
    notes: "",
    hairStyleName: "",
    stylistId: "",
    stylistName: "",
    isPublic: true,
    sharedWithUserIds: "",
    rating: "",
    images: [],
  });

  // Profile image preview and upload state
  const [sidebarProfileUrl, setSidebarProfileUrl] = useState(
    user?.imageUrl ||
      localStorage.getItem("profilePicture") ||
      "/placeholder.png",
  );
  const [profilePreviewUrl, setProfilePreviewUrl] = useState(null);
  const [isProfilePreviewOpen, setIsProfilePreviewOpen] = useState(false);

  const openProfilePreview = (url) => {
    setProfilePreviewUrl(url || null);
    setIsProfilePreviewOpen(true);
  };

  useEffect(() => {
    setSidebarProfileUrl(
      user?.imageUrl ||
        localStorage.getItem("profilePicture") ||
        "/placeholder.png",
    );
  }, [user?.imageUrl]);

  const closeProfilePreview = () => {
    setProfilePreviewUrl(null);
    setIsProfilePreviewOpen(false);
  };

  const handleProfileEdit = async (file) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("Image", file);
      formData.append("IsMain", "true");

      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "multipart/form-data",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await apiClient.post("/users/add-photo", formData, {
        headers,
      });

      showToast.success("Profile photo updated");

      // refresh feeds/my posts so the new image is reflected
      if (typeof loadSocialFeed === "function") loadSocialFeed();
      if (typeof loadMyPosts === "function") loadMyPosts();

      // if backend returned an image url, store it locally for immediate feedback
      const returnedUrl = res?.data?.data?.imageUrl || res?.data?.data?.url;
      if (returnedUrl) {
        localStorage.setItem("profilePicture", returnedUrl);
        setProfilePreviewUrl(returnedUrl);
        setSidebarProfileUrl(returnedUrl);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      showToast.error("Unable to upload profile photo.");
    } finally {
    }
  };

  const loadSocialFeed = useCallback(async () => {
    if (!user?.userId) return;

    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await apiClient.get(`/users/social-feed/${user.userId}`);
      setPosts(response.data?.data || []);
      setActiveTab("social");
    } catch (err) {
      console.error(err);
      setErrorMessage("Unable to load community feed.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId]);

  const loadMyPosts = async () => {
    if (!user?.userId) return;

    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await apiClient.get(`/users/userPosts/${user.userId}`);
      setMyPosts(response.data?.data || []);
      setActiveTab("myposts");
    } catch (err) {
      console.error(err);
      setErrorMessage("Unable to load your posts.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMyJournals = async () => {
    if (!user?.userId) return;

    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await apiClient.get(`/users/userJournal/${user.userId}`);
      setJournals(response.data?.data || []);
      setActiveTab("journals");
    } catch (err) {
      console.error(err);
      setErrorMessage("Unable to load your journals.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      loadSocialFeed();
    }
  }, [loadSocialFeed, user?.userId]);

  const handlePostInputChange = (e) => {
    const { name, value } = e.target;
    setPostForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePostFileChange = (e) => {
    const { name, files } = e.target;
    setPostForm((prev) => ({
      ...prev,
      [name]: files[0] || null,
    }));
  };

  const submitHairPost = async (e) => {
    e.preventDefault();

    if (!user?.userId) return;

    const formData = new FormData();
    formData.append("userId", user.userId);
    formData.append("caption", postForm.caption);
    formData.append("mood", postForm.mood);
    formData.append("hairStyleName", postForm.hairStyleName);

    if (postForm.beforeImage) {
      formData.append("BeforeImage", postForm.beforeImage);
    }

    if (postForm.afterImage) {
      formData.append("AfterImage", postForm.afterImage);
    }

    try {
      await apiClient.post("/users/add-hair-journey-post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowPostModal(false);
      setPostForm({
        hairStyleName: "",
        caption: "",
        mood: "",
        beforeImage: null,
        afterImage: null,
      });
      loadMyPosts();
    } catch (err) {
      console.error(err);
      setErrorMessage("Unable to create your post.");
    }
  };

  const handleJournalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJournalForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleJournalFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setJournalForm((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const submitJournal = async (e) => {
    e.preventDefault();

    if (!user?.userId) return;

    const formData = new FormData();
    formData.append("userId", user.userId);
    formData.append("title", journalForm.title);
    formData.append("notes", journalForm.notes);

    if (journalForm.hairStyleName) {
      formData.append("hairStyleName", journalForm.hairStyleName);
    }

    if (journalForm.stylistId) {
      formData.append("stylistId", journalForm.stylistId);
    }

    if (journalForm.stylistName) {
      formData.append("stylistName", journalForm.stylistName);
    }

    formData.append("isPublic", journalForm.isPublic.toString());

    if (journalForm.sharedWithUserIds) {
      journalForm.sharedWithUserIds
        .split(",")
        .map((userId) => userId.trim())
        .filter(Boolean)
        .forEach((userId) => {
          formData.append("sharedWithUserIds", userId);
        });
    }

    if (journalForm.rating) {
      formData.append("rating", journalForm.rating);
    }

    journalForm.images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await apiClient.post("/users/journal-record", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowJournalModal(false);
      setJournalForm({
        title: "",
        notes: "",
        hairStyleName: "",
        stylistId: "",
        stylistName: "",
        isPublic: true,
        sharedWithUserIds: "",
        rating: "",
        images: [],
      });
      loadMyJournals();
    } catch (err) {
      console.error(err);
      setErrorMessage("Unable to create your journal.");
    }
  };

  const renderPostCard = (post) => {
    const postImages = post.photos || post.images || [];
    const beforeAfterImages = [];

    const beforeSrc = post.beforeImage || post.beforeImageUrl;
    const afterSrc = post.afterImage || post.afterImageUrl;

    if (beforeSrc) {
      beforeAfterImages.push({ label: "Before", src: beforeSrc });
    }
    if (afterSrc) {
      beforeAfterImages.push({ label: "After", src: afterSrc });
    }

    const remainingImages = postImages.filter((photo) => {
      const src = photo.url || photo.imageUrl || photo;
      return !beforeAfterImages.some((item) => item.src === src);
    });

    return (
      <div key={post.id || post.postId} className="feed-card">
        <div className="feed-header">
          <div
            className="profile-pic-container"
            style={{ position: "relative" }}
          >
            <img
              src={
                post.profilePicture ||
                post.userImageUrl ||
                localStorage.getItem("profilePicture") ||
                "/placeholder.png"
              }
              alt={post.userName || "User profile"}
              className="profile-pic"
              style={{ cursor: "pointer" }}
              onClick={() =>
                openProfilePreview(
                  post.profilePicture ||
                    post.userImageUrl ||
                    localStorage.getItem("profilePicture"),
                )
              }
            />
          </div>
          <div>
            <h4>{post.userName || "Anonymous"}</h4>
            <small>
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString()
                : "Recently"}
            </small>
          </div>
        </div>

        <h3>{post.hairStyleName || "Hair Journey"}</h3>
        <p>{post.caption || "No caption available."}</p>

        {post.mood && <span className="mood-badge">Mood: {post.mood}</span>}

        {(beforeAfterImages.length > 0 || remainingImages.length > 0) && (
          <div className="feed-images">
            {beforeAfterImages.map((item, index) => (
              <div key={`${item.label}-${index}`} className="feed-image-card">
                <span className="image-label">{item.label}</span>
                <img src={item.src} alt={item.label} className="feed-image" />
              </div>
            ))}
            {remainingImages.map((photo, index) => {
              const src = photo.url || photo.imageUrl || photo;
              return (
                <div
                  key={photo.id || `${post.id}-extra-${index}`}
                  className="feed-image-card"
                >
                  <img
                    src={src}
                    alt={`Post ${index + 1}`}
                    className="feed-image"
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="feed-actions">
          <span>❤️ {post.likesCount || 0}</span>
          <span>💬 {post.commentsCount || 0}</span>
        </div>
      </div>
    );
  };

  const renderJournalCard = (journal) => {
    const journalPhotos = [
      ...(Array.isArray(journal.photos) ? journal.photos : []),
      ...(Array.isArray(journal.Photos) ? journal.Photos : []),
      ...(Array.isArray(journal.posts) ? journal.posts : []),
      ...(Array.isArray(journal.Posts) ? journal.Posts : []),
    ]
      .map((photo) => ({
        src: photo?.url || photo?.imageUrl || photo?.photoUrl || photo,
        id: photo?.id || photo?.photoId || null,
      }))
      .filter((photo) => photo.src)
      .filter(
        (photo, index, self) =>
          index === self.findIndex((item) => item.src === photo.src),
      );

    return (
      <div key={journal.id || journal.journalId} className="feed-card">
        <div className="feed-header">
          <div>
            <h4>{journal.title || "Journal Entry"}</h4>
            <small>
              {journal.createdAt
                ? new Date(journal.createdAt).toLocaleDateString()
                : "Recently"}
            </small>
          </div>
        </div>
        <h3>{journal.hairStyleName || "Hair Journal"}</h3>
        <p>{journal.notes || "No notes available."}</p>
        {journal.rating && <p>Rating: {journal.rating}/5</p>}

        {journalPhotos.length > 0 && (
          <div className="feed-images">
            {journalPhotos.map((photo, index) => (
              <div
                key={
                  photo.id ||
                  `${journal.id || journal.journalId}-photo-${index}`
                }
                className="feed-image-card"
              >
                <img
                  src={photo.src}
                  alt={`Journal ${index + 1}`}
                  className="feed-image"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="feed-page">
      <section className="feed-banner">
        <div className="feed-banner-content">
          <h1>Hair Community Feeds</h1>
          <p>
            Connect with other users, discover new hair journeys, and share your
            own stories.
          </p>
        </div>

        <div className="feed-banner-images">
          <img src={BannerImage1} alt="Community Feed Banner 1" />
          <img src={BannerImage2} alt="Community Feed Banner 2" />
          <img src={BannerImage3} alt="Community Feed Banner 3" />
        </div>
      </section>

      {errorMessage && <p className="feed-empty">{errorMessage}</p>}

      <div className="feed-layout">
        <aside className="feed-sidebar">
          <div
            className="sidebar-profile-wrapper"
            onClick={() =>
              document.getElementById("sidebar-profile-upload")?.click()
            }
          >
            <img
              src={sidebarProfileUrl || "/placeholder.png"}
              alt={user?.firstName || "User"}
              className="sidebar-profile"
            />
            <button
              type="button"
              className="sidebar-profile-edit"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById("sidebar-profile-upload")?.click();
              }}
            >
              ✎
            </button>
            <input
              id="sidebar-profile-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files && e.target.files[0];
                handleProfileEdit(file);
                e.target.value = null;
              }}
            />
          </div>
          <h3>
            {user?.firstName || "User"} {user?.lastName || ""}
          </h3>

          <button className="sidebar-btn" onClick={loadSocialFeed}>
            Community Feed
          </button>
          <button className="sidebar-btn" onClick={loadMyPosts}>
            My Posts
          </button>
          <button className="sidebar-btn" onClick={loadMyJournals}>
            My Journals
          </button>
          <button
            className="sidebar-btn"
            onClick={() => setShowPostModal(true)}
          >
            + Hair Journey Post
          </button>
          <button
            className="sidebar-btn"
            onClick={() => setShowJournalModal(true)}
          >
            + Hair Journal
          </button>
        </aside>

        <main className="feed-content">
          {isLoading ? (
            <p className="feed-loading">Loading...</p>
          ) : (
            <>
              {activeTab === "social" &&
                (posts.length > 0
                  ? posts.map((post) => renderPostCard(post))
                  : !errorMessage && (
                      <p className="feed-empty">No posts yet.</p>
                    ))}

              {activeTab === "myposts" &&
                (myPosts.length > 0
                  ? myPosts.map((post) => renderPostCard(post))
                  : !errorMessage && (
                      <p className="feed-empty">You have no posts yet.</p>
                    ))}

              {activeTab === "journals" &&
                (journals.length > 0
                  ? journals.map((journal) => renderJournalCard(journal))
                  : !errorMessage && (
                      <p className="feed-empty">You have no journals yet.</p>
                    ))}
            </>
          )}
        </main>
      </div>

      {showPostModal && (
        <div className="feed-modal-overlay">
          <div className="feed-modal">
            <div className="feed-modal-header">
              <h3>Create Hair Journey Post</h3>
            </div>
            <form className="feed-modal-form" onSubmit={submitHairPost}>
              <div className="feed-field-group">
                <label htmlFor="hairStyleName">Hairstyle Name</label>
                <input
                  id="hairStyleName"
                  className="feed-input"
                  type="text"
                  name="hairStyleName"
                  placeholder="e.g. Silk Press Glow"
                  value={postForm.hairStyleName}
                  onChange={handlePostInputChange}
                />
              </div>

              <div className="feed-field-group">
                <label htmlFor="caption">Caption</label>
                <textarea
                  id="caption"
                  className="feed-textarea"
                  name="caption"
                  placeholder="Share your glow-up story..."
                  value={postForm.caption}
                  onChange={handlePostInputChange}
                />
              </div>

              <div className="feed-field-group">
                <label htmlFor="mood">Mood</label>
                <input
                  id="mood"
                  className="feed-input"
                  type="text"
                  name="mood"
                  placeholder="Confident, Fresh, Relaxed"
                  value={postForm.mood}
                  onChange={handlePostInputChange}
                />
              </div>

              <div className="feed-file-row">
                <label className="feed-file-label">
                  Before Image
                  <input
                    className="feed-file-input"
                    type="file"
                    name="beforeImage"
                    accept="image/*"
                    onChange={handlePostFileChange}
                  />
                </label>
                <label className="feed-file-label">
                  After Image
                  <input
                    className="feed-file-input"
                    type="file"
                    name="afterImage"
                    accept="image/*"
                    onChange={handlePostFileChange}
                  />
                </label>
              </div>

              <div className="feed-modal-actions">
                <button
                  type="button"
                  className="feed-btn-secondary"
                  onClick={() => setShowPostModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="feed-btn-primary">
                  Create Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showJournalModal && (
        <div className="feed-modal-overlay">
          <div className="feed-modal">
            <div className="feed-modal-header">
              <h3>Create Hair Journal</h3>
            </div>
            <form className="feed-modal-form" onSubmit={submitJournal}>
              <div className="feed-field-group">
                <label htmlFor="journalTitle">Journal Title</label>
                <input
                  id="journalTitle"
                  className="feed-input"
                  type="text"
                  name="title"
                  placeholder="My Weekly Hair Progress"
                  value={journalForm.title}
                  onChange={handleJournalInputChange}
                />
              </div>

              <div className="feed-field-group">
                <label htmlFor="journalNotes">Notes</label>
                <textarea
                  id="journalNotes"
                  className="feed-textarea"
                  name="notes"
                  placeholder="Write your hair care routine, thoughts, and progress..."
                  value={journalForm.notes}
                  onChange={handleJournalInputChange}
                />
              </div>

              <div className="feed-field-group">
                <label htmlFor="journalStyle">Hairstyle Name</label>
                <input
                  id="journalStyle"
                  className="feed-input"
                  type="text"
                  name="hairStyleName"
                  placeholder="e.g. Box Braids"
                  value={journalForm.hairStyleName}
                  onChange={handleJournalInputChange}
                />
              </div>

              <div className="feed-field-group">
                <label htmlFor="stylistId">Stylist ID</label>
                <input
                  id="stylistId"
                  className="feed-input"
                  type="text"
                  name="stylistId"
                  placeholder="Stylist ID"
                  value={journalForm.stylistId}
                  onChange={handleJournalInputChange}
                />
              </div>

              <div className="feed-field-group">
                <label htmlFor="stylistName">Stylist Name</label>
                <input
                  id="stylistName"
                  className="feed-input"
                  type="text"
                  name="stylistName"
                  placeholder="Stylist Name"
                  value={journalForm.stylistName}
                  onChange={handleJournalInputChange}
                />
              </div>

              <div className="feed-field-group feed-field-group--checkbox">
                <label htmlFor="journalIsPublic">
                  <input
                    id="journalIsPublic"
                    type="checkbox"
                    name="isPublic"
                    checked={journalForm.isPublic}
                    onChange={handleJournalInputChange}
                  />
                  <span>Make journal public</span>
                </label>
              </div>

              <div className="feed-field-group">
                <label htmlFor="sharedWithUserIds">Share with User IDs</label>
                <input
                  id="sharedWithUserIds"
                  className="feed-input"
                  type="text"
                  name="sharedWithUserIds"
                  placeholder="Add user IDs separated by commas"
                  value={journalForm.sharedWithUserIds}
                  onChange={handleJournalInputChange}
                />
              </div>

              <div className="feed-field-group">
                <label htmlFor="journalRating">Rating (1-5)</label>
                <input
                  id="journalRating"
                  className="feed-input"
                  type="number"
                  name="rating"
                  min="1"
                  max="5"
                  placeholder="5"
                  value={journalForm.rating}
                  onChange={handleJournalInputChange}
                />
              </div>

              <div className="feed-field-group">
                <label htmlFor="journalImages">Add Images</label>
                <input
                  id="journalImages"
                  className="feed-file-input feed-file-input--full"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleJournalFileChange}
                />
              </div>

              <div className="feed-modal-actions">
                <button
                  type="button"
                  className="feed-btn-secondary"
                  onClick={() => setShowJournalModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="feed-btn-primary">
                  Save Journal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isProfilePreviewOpen && (
        <div className="feed-modal-overlay" onClick={closeProfilePreview}>
          <div
            className="feed-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 800 }}
          >
            <div className="feed-modal-header">
              <h3>Profile Photo</h3>
              <button
                type="button"
                className="feed-btn-secondary"
                onClick={closeProfilePreview}
                style={{ marginLeft: "auto" }}
              >
                Close
              </button>
            </div>
            <div style={{ textAlign: "center" }}>
              <img
                src={profilePreviewUrl || "/placeholder.png"}
                alt="Profile preview"
                style={{ maxWidth: "100%", maxHeight: "70vh" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feeds;
