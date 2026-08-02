const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 1. Tell Firebase we need to use the secret key we just saved
const geminiApiKey = defineSecret("GEMINI_API_KEY");

exports.scanRecipe = onCall(
  { secrets: [geminiApiKey] }, // Give this function permission to read the secret
  async (request) => {
    try {
      const base64Image = request.data.image;

      if (!base64Image || typeof base64Image !== "string") {
        throw new HttpsError("invalid-argument", "No image provided");
      }

      const cleanedBase64 = base64Image.includes(",") ? base64Image.split(",")[1] : base64Image;
      if (!cleanedBase64 || cleanedBase64.length < 100) {
        throw new HttpsError("invalid-argument", "Image payload is too small or invalid");
      }

      // 2. Initialize the Gemini AI using your secret key
      const apiKey = geminiApiKey.value();
      if (!apiKey) {
        throw new HttpsError("failed-precondition", "Missing GEMINI_API_KEY secret");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      
      // Use a newer Gemini flash model for image analysis.
      const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

      // 3. The magic prompt strictly asking for JSON
      const prompt = `
        You are a culinary AI data extractor. Look at the provided image of a recipe.
        Extract the information and return it strictly as a JSON object that matches this exact structure.
        Do NOT wrap the response in markdown blocks like \`\`\`json. Return ONLY the raw JSON object.
        
        {
          "title": "Recipe Title",
          "subtitle": "Brief description if applicable, otherwise empty string",
          "time": "Total time (e.g. 45 min)",
          "difficulty": "Easy, Intermediate, or Advanced based on steps",
          "servings": "Number of servings (e.g. 4 People)",
          "ingredients": [
            {
              "category": "MAIN (or other logical grouping)",
              "items": [
                { "name": "Ingredient Name", "amount": "Measurement (e.g. 1 cup)" }
              ]
            }
          ],
          "instructions": [
            { "text": "Step 1 instruction...", "timer": "MM:SS if applicable, otherwise empty string" }
          ]
        }
      `;

      // 4. Format the image exactly how Gemini requires it
      const mimeType = base64Image.includes("data:image/png;base64")
        ? "image/png"
        : base64Image.includes("data:image/webp;base64")
          ? "image/webp"
          : "image/jpeg";

      const imagePart = {
        inlineData: {
          data: cleanedBase64,
          mimeType
        }
      };

      console.log("Sending prompt and image to Gemini...");

      // 5. Fire the request to the AI
      const result = await model.generateContent([prompt, imagePart]);
      const responseText = result?.response?.text?.() || "";

      if (!responseText) {
        throw new HttpsError("internal", "Gemini returned an empty response");
      }
      
      // 6. Clean up the AI's response (just in case it ignored our rule and added markdown formatting)
      const cleanJsonString = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
      
      // 7. Parse the string into a real JavaScript object
      let extractedRecipe;
      try {
        extractedRecipe = JSON.parse(cleanJsonString);
      } catch (parseError) {
        console.error("Failed to parse Gemini JSON:", parseError, "Raw response:", responseText);
        throw new HttpsError("internal", "Gemini returned invalid JSON");
      }

      // 8. Send it back to the React frontend!
      return { recipe: extractedRecipe };

    } catch (error) {
      console.error("AI Scanning Error:", error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError("internal", error?.message || "Failed to process the recipe image.");
    }
  }
);