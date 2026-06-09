// import React from "react";
// import "./Modal.css";

// export default function ViewDetailsModal({
//   isOpen,
//   onClose,
//   style,
//   photos = [],
// }) {
//   if (!isOpen || !style) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-box large">
//         <h2>{style.styleName} – Details</h2>

//         {/* PHOTO GALLERY */}
//         <div className="hairstyle-photos">
//           {photos.length > 0 ? (
//             photos.map((photo, index) => (
//               <img
//                 key={index}
//                 src={photo}
//                 alt={`${style.styleName} view ${index + 1}`}
//                 className="hairstyle-photo"
//               />
//             ))
//           ) : (
//             <p>No hairstyle photos available.</p>
//           )}
//         </div>

//         {/* OPTIONAL DETAILS */}
//         <div className="hairstyle-info">
//           <p>
//             <strong>Description:</strong>{" "}
//             {style.description || "No description available."}
//           </p>

//           <p>
//             <strong>Price:</strong> ${style.priceTag || 0}
//           </p>

//           <p>
//             <strong>Origin:</strong> {style.origin || "Unknown"}
//           </p>
//         </div>

//         <button className="modal-close" onClick={onClose}>
//           Close
//         </button>
//       </div>
//     </div>
//   );
// }

import React from "react";

import "./Modal.css";

export default function ViewDetailsModal({
  isOpen,
  onClose,
  onBack,
  style,
  photos = [],
  errorMessage = "",
}) {
  if (!isOpen || !style) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box large">
        <h2>{style.styleName}</h2>

        {/* PHOTO GALLERY */}
        <div className="hairstyle-photos">
          {errorMessage ? (
            <div className="details-error">{errorMessage}</div>
          ) : photos.length > 0 ? (
            photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`${style.styleName} view ${index + 1}`}
                className="hairstyle-photo"
              />
            ))
          ) : (
            <p>No hairstyle photos available.</p>
          )}
        </div>

        <div className="hairstyle-info">
          <p>
            <strong>Description:</strong> {style.description}
          </p>

          <p>
            <strong>Origin:</strong> {style.origin}
          </p>

          <p>
            <strong>Price:</strong> ${style.priceTag}
          </p>
        </div>

        <div className="modal-actions">
          <button className="modal-btn" onClick={onBack}>
            ← Back
          </button>

          <button className="modal-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
