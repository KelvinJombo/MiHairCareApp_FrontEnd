import React, { useState } from "react";
import apiClient from "../../api/client";
import "./AdminHairCare.css";

export default function AdminHairCare() {
  const [formData, setFormData] = useState({
    type: "hairStyle", // or "product"
    id: "",
    name: "",
    description: "",
    price: "",
    brand: "",
    stockQuantity: "",
    image: null,
  });
  const [editing, setEditing] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("hairStyle");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Create or Update item
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const form = new FormData();
      if (formData.type === "hairStyle") {
        form.append("StyleName", formData.name);
        form.append("Description", formData.description);
        form.append("PriceTag", formData.price);
        if (formData.image) form.append("Image", formData.image);

        if (editing) {
          await apiClient.put(`/HairStyles/${formData.id}`, form);
        } else {
          await apiClient.post("/HairStyles/create", form);
        }
      } else {
        form.append("ProductName", formData.name);
        form.append("Brand", formData.brand);
        form.append("Description", formData.description);
        form.append("Price", formData.price);
        form.append("StockQuantity", formData.stockQuantity);
        if (formData.image) form.append("Image", formData.image);

        if (editing) {
          await apiClient.put(`/HairCareProducts/${formData.id}`, form);
        } else {
          await apiClient.post("/HairCareProducts/create", form);
        }
      }
      alert(`${editing ? "Updated" : "Created"} successfully!`);
      setFormData({
        type: "hairStyle",
        id: "",
        name: "",
        description: "",
        price: "",
        brand: "",
        stockQuantity: "",
        image: null,
      });
      setEditing(false);
    } catch (err) {
      console.error(err);
      setError("Failed to save data.");
    }
  };

  // Fetch a particular item by name
  const handleFetch = async () => {
    if (!searchName) return;
    setError("");
    setLoading(true);
    try {
      const endpoint =
        searchType === "hairStyle"
          ? `/HairStyles/by-name/${searchName}`
          : `/HairCareProducts/by-name/${searchName}`;

      const res = await apiClient.get(endpoint);

      if (res.data.succeeded && res.data.data) {
        const item = res.data.data;
        setEditing(true);
        setFormData({
          type: searchType,
          id: item.hairStyleId || item.id,
          name: item.styleName || item.productName,
          description: item.description,
          price: item.priceTag || item.price,
          brand: item.brandName || item.brand || "",
          stockQuantity: item.stockQuantity || "",
          image: null,
        });
      } else {
        setError("Item not found.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch item.");
    } finally {
      setLoading(false);
    }
  };

  // Delete the currently fetched item
  const handleDelete = async () => {
    if (!formData.id) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await apiClient.delete(
        `/${formData.type === "hairStyle" ? "HairStyles" : "HairCareProducts"}/${
          formData.id
        }`
      );
      alert("Item deleted successfully!");
      setFormData({
        type: "hairStyle",
        id: "",
        name: "",
        description: "",
        price: "",
        brand: "",
        stockQuantity: "",
        image: null,
      });
      setEditing(false);
    } catch (err) {
      console.error(err);
      setError("Failed to delete item.");
    }
  };

  return (
    <div className="admin-page">
      <h1>HairCare Admin Dashboard</h1>

      {/* Fetch Section */}
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

      {/* Form Section */}
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
            placeholder="Brand"
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
        {formData.type === "product" && (
          <input
            type="number"
            name="stockQuantity"
            placeholder="Stock Quantity"
            value={formData.stockQuantity}
            onChange={handleChange}
          />
        )}
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
