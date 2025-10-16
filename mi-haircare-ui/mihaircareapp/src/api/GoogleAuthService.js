const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://localhost:7261/api";

export const registerWithGoogle = async (idToken, phoneNumber) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Authentication/RegisterWithGoogle`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken, phoneNumber }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in registerWithGoogle API:", error);
    throw error;
  }
};
