const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const analyzeSymptoms = async (data) => {
  try {
    const token = localStorage.getItem("exora_token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Server error");
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return { message: "Failed to connect to backend" };
  }
};