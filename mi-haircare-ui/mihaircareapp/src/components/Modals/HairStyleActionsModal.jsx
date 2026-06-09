// import React from "react";
// import "./Modal.css";

// export default function HairStyleActionsModal({ isOpen, onClose, onDetails, onStylists }) {
//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-box">
//         <h2>Select an Option</h2>

//         <button className="modal-btn" onClick={onDetails}>
//           View Details
//         </button>

//         <button className="modal-btn" onClick={onStylists}>
//           View Stylists
//         </button>

//         <button className="modal-close" onClick={onClose}>Close</button>
//       </div>
//     </div>
//   );
// }

import React from "react";

import "./Modal.css";

export default function HairStyleActionsModal({
  isOpen,
  onClose,
  onDetails,
  onStylists,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Select an Option</h2>

        <button className="modal-btn" onClick={onDetails}>
          View Details
        </button>

        <button className="modal-btn" onClick={onStylists}>
          View Stylists
        </button>

        <button className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
