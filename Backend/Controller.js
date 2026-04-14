import fs from "fs";
import Papa from "papaparse";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";


dotenv.config();





export const uploadFile = (req, res) => {
  const filePath = req.file.path;

  // read file
  const file = fs.readFileSync(filePath, "utf8");

  // parse CSV
  const parsedData = Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
  });

  console.log(parsedData.data);

  res.json({
    message: "File processed successfully",
    data: parsedData.data,
  });
};


//ai
export const handleAIQuery = async (req, res) => {
  try {
    const { query, data } = req.body;

    if (!data?.length) {
      return res.status(400).json({ error: "No data provided" });
    }

    const cleanedData = data.map(row => {
      const newRow = {};
      for (let key in row) {
        const value = row[key];
        newRow[key] =
          !isNaN(value) && value !== "" ? Number(value) : value;
      }
      return newRow;
    });

   
    const prompt = `
You are a professional business analyst AI.

Dataset:
${JSON.stringify(cleanedData)}

User Question:
"${query}"

IMPORTANT:
Return ONLY valid JSON (no extra text)

Format:
{
  "answer": "detailed human-like answer",
  "chartType": "bar | line | pie | none",
  "labels": ["A","B"],
  "values": [10,20],
  "insight": "short business insight",
  "suggestion": "what should business improve"
}

Rules:
- Answer like ChatGPT (natural, not robotic)
- Do proper analysis (NOT generic like 'business is good')
- ALWAYS mention key numbers in answer
- Explain WHY (reasoning required)
- Highlight best and worst areas
- If user does not specify metric, use total value (price * quantity)
- Chart rules:
    trend → line
    comparison → bar
    category → pie
- labels = names
- values = calculated numbers
- If no chart needed → chartType = "none"
`;

   
    const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROKEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2
      })
    });

    const aiData = await aiRes.json();

    let output = aiData?.choices?.[0]?.message?.content || "{}";

    let parsed;
    try {
      parsed = JSON.parse(output);
    } catch (e) {
      parsed = {
        answer: output,
        chartType: "none",
        labels: [],
        values: [],
        insight: "",
        suggestion: ""
      };
    }

    return res.json({
      success: true,
      query,
      answer: parsed.answer,
      chartType: parsed.chartType,
      labels: parsed.labels,
      values: parsed.values,
      insight: parsed.insight,
      suggestion: parsed.suggestion
    });

  } catch (err) {
    console.error("AI ERROR:", err);

    return res.status(500).json({
      success: false,
      error: "Something went wrong"
    });
  }
};