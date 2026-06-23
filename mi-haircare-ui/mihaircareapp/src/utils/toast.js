import { toast } from "react-toastify";

const defaultOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const showToast = {
  success: (msg, opts = {}) =>
    toast.success(msg, { ...defaultOptions, ...opts }),
  error: (msg, opts = {}) => toast.error(msg, { ...defaultOptions, ...opts }),
  info: (msg, opts = {}) => toast.info(msg, { ...defaultOptions, ...opts }),
  warn: (msg, opts = {}) => toast.warn(msg, { ...defaultOptions, ...opts }),
};

export default showToast;
