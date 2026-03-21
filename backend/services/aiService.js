const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeWithAI = async (symptoms, description) => {
  try {

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
You are a healthcare recovery monitoring assistant.

Patient Symptoms: ${symptoms.join(", ")}
Patient Description: ${description}

Give short recovery advice.
Do NOT prescribe medicines.
Explain when the patient should contact a doctor.
Limit response to 80-100 words.
`;

    // Hard 20s timeout — prevents Render from killing the whole connection
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Gemini timeout after 20s")), 20000)
      )
    ]);

    return result.response.text();

  } catch (error) {
    console.error("AI error:", error.message);
    return "Please monitor your symptoms and contact your doctor if your condition worsens.";
  }
};
