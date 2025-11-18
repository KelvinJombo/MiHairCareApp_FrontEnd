// Updated React component integrating backend DTO requirements
import React, { useState } from "react";
import apiClient from "../../api/client";
import "./AdminHairCare.css";

export default function AdminHairCare() {
  const [formData, setFormData] = useState({
    type: "hairStyle",
    id: "",
    name: "",
    description: "",
    price: "",
    origin: "",
    brand: "",
    stockQuantity: "",
    image: null,
    currentImageUrl: null,
    isMainPhoto: true,
    isMain: true,
  });

  const [editing, setEditing] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("hairStyle");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const hairStyleOrigins = ["African", "American", "European", "Asian"];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : files && files.length > 0
          ? files[0]
          : value,
    }));
  };

  const storedId = localStorage.getItem("CURRENT_ITEM_ID");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const storedId = localStorage.getItem("CURRENT_ITEM_ID");

    // VALIDATION
    if (!formData.name.trim()) return setError("Name is required.");

    if (!formData.description.trim())
      return setError("Description is required.");

    if (!formData.price || Number(formData.price) <= 0)
      return setError("Price must be greater than 0.");

    if (formData.type === "hairStyle" && !formData.origin)
      return setError("Please select a hairstyle origin.");

    if (formData.type === "product") {
      if (formData.stockQuantity === "" || Number(formData.stockQuantity) < 0)
        return setError("Stock quantity must be 0 or more.");
    }

    try {
      const form = new FormData();

      // HAIRSTYLES
      if (formData.type === "hairStyle") {
        form.append("StyleName", formData.name);
        form.append("Description", formData.description);
        form.append("PriceTag", formData.price);
        form.append("Origin", formData.origin);
        form.append("IsMainPhoto", formData.isMainPhoto);

        if (formData.image) form.append("Image", formData.image);

        if (editing) {
          form.append("HairStyleId", storedId);
          form.append("IsMain", formData.isMain ? "true" : "false");

          await apiClient.put("/HairStyles/update", form, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          await apiClient.post("/HairStyles/addHairStyle", form, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      // PRODUCTS
      else {
        form.append("ProductName", formData.name);
        form.append("Brand", formData.brand);
        form.append("Description", formData.description);
        form.append("Price", formData.price);
        form.append("StockQuantity", formData.stockQuantity);
        form.append("IsMainPhoto", formData.isMainPhoto);

        if (formData.image) form.append("Image", formData.image);

        if (editing) {
          form.append("Id", storedId);

          await apiClient.put("/Products/update", form, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          await apiClient.post("/Products", form, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      alert(editing ? "Updated successfully!" : "Created successfully!");

      resetForm();
      localStorage.removeItem("CURRENT_ITEM_ID");
    } catch (error) {
      console.log(error);
      setError("Failed to save data.");
    }
  };

  const handleFetch = async () => {
    if (!searchName) return;
    setLoading(true);
    setError("");

    try {
      const endpoint =
        searchType === "hairStyle"
          ? `/HairStyles/getByTitle?hairStyleTitle=${searchName}`
          : `/Products/getByName?productName=${searchName}`;

      const res = await apiClient.get(endpoint);
      const item = res.data.data;

      if (res.data.succeeded && item) {
        setEditing(true);
        const itemId = item.hairStyleId || item.id;

        // Store behind the scenes
        localStorage.setItem("CURRENT_ITEM_ID", itemId);

        setFormData({
          type: searchType,
          id: "", // <-- DO NOT EXPOSE ID IN UI ANYMORE
          name: item.styleName || item.productName,
          description: item.description,
          price: item.priceTag || item.price,
          origin: item.origin || "",
          brand: item.brand || "",
          stockQuantity: item.stockQuantity || "",
          image: null,
          currentImageUrl: item.imageUrl || null,
          isMainPhoto: item.isMainPhoto ?? true,
          isMain: item.isMain ?? true,
        });
      } else {
        setError("Item not found.");
      }
    } catch {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const storedId = localStorage.getItem("CURRENT_ITEM_ID");
    if (!storedId) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      if (formData.type === "hairStyle") {
        await apiClient.delete(
          `/HairStyles/deleteHairStyle?hairStyleId=${storedId}`
        );
      } else {
        await apiClient.delete(`/Products/delete?id=${storedId}`);
      }
      alert("Item deleted successfully!");
      localStorage.removeItem("CURRENT_ITEM_ID");
      resetForm();
    } catch {
      setError("Failed to delete item.");
    }
  };

  const resetForm = () => {
    setFormData({
      type: "hairStyle",
      id: "",
      name: "",
      description: "",
      price: "",
      origin: "",
      brand: "",
      stockQuantity: "",
      image: null,
      currentImageUrl: null,
      isMainPhoto: true,
      isMain: true,
    });
    setEditing(false);
    setError("");
  };

  return (
    <div className="admin-page">
      <h1>HairCare Admin Dashboard</h1>

      <div className="fetch-section">
        <h2>Fetch Item to Edit/Delete</h2>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="hairStyle">HairStyle</option>
          <option value="product">HairCare Product</option>
        </select>

        <input
          type="text"
          placeholder={`Enter ${searchType} name`}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />

        <button onClick={handleFetch} disabled={loading}>
          {loading ? "Fetching..." : "Fetch"}
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>{editing ? "Edit Item" : "Add New Item"}</h2>

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          disabled={editing}
        >
          <option value="hairStyle">HairStyle</option>
          <option value="product">HairCare Product</option>
        </select>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {formData.type === "product" && (
          <input
            type="text"
            name="brand"
            placeholder="Brand Name"
            value={formData.brand}
            onChange={handleChange}
          />
        )}

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        {formData.type === "hairStyle" && (
          <select
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            required
          >
            <option value="">Select Origin</option>
            {hairStyleOrigins.map((origin) => (
              <option key={origin} value={origin}>
                {origin}
              </option>
            ))}
          </select>
        )}

        {formData.type === "product" && (
          <input
            type="number"
            name="stockQuantity"
            placeholder="Stock Quantity"
            value={formData.stockQuantity}
            onChange={handleChange}
          />
        )}

        {editing && formData.currentImageUrl && (
          <div className="image-preview">
            <p>Current Image:</p>
            <img src={formData.currentImageUrl} alt="Current" />
          </div>
        )}

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isMainPhoto"
            checked={formData.isMainPhoto}
            onChange={handleChange}
          />
          <span>Is Main Photo</span>
        </label>

        <input type="file" name="image" onChange={handleChange} />

        <div className="form-buttons">
          <button type="submit">{editing ? "Update" : "Create"}</button>
          {editing && (
            <button type="button" className="delete-btn" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
