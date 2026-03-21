const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeWithAI = async (symptoms, description) => {
  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
You are a healthcare recovery monitoring assistant.

Patient Symptoms:
${symptoms.join(", ")}

Patient Description:
${description}

Give short recovery advice.
Do NOT prescribe medicines.
Explain when the patient should contact a doctor.
Limit response to 80-100 words.
`;

    const result = await model.generateContent(prompt);

    const response = await result.response;

    return response.text();

  } catch (error) {

    console.error("AI error:", error.message);

    return "Please monitor symptoms and contact your doctor if the condition worsens.";

  }
};
