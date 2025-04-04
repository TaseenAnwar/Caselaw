// server.js - Basic Express server for the Caselaw Search app

// Import required packages
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse JSON request bodies

// Check if the OpenAI API key is set
if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set in the environment variables');
  process.exit(1);
}

// API endpoint to handle caselaw search requests
app.post('/api/search', async (req, res) => {
  try {
    // Get data from request body
    const { legalIssue, jurisdiction, lawTypes } = req.body;
    
    // Validate required fields
    if (!legalIssue || !jurisdiction || !lawTypes) {
      return res.status(400).json({ 
        error: 'Missing required fields. Please provide legalIssue, jurisdiction, and lawTypes.' 
      });
    }
    
    // Prepare the prompt for OpenAI
    const prompt = `You are a legal research assistant. I need the 5 most relevant cases for the following legal issue:
    Legal issue: ${legalIssue}
    Jurisdiction: ${jurisdiction}
    Areas of law: ${lawTypes}

    For each case, provide:
    1. The case name
    2. A 100-200 word summary of the case and its specific relevance to my issue
    3. The complete Bluebook citation

    Format your response as JSON with the following structure:
    {
        "cases": [
            {
                "name": "Case Name",
                "summary": "Case summary and relevance...",
                "citation": "Complete Bluebook citation"
            },
            ... (4 more cases)
        ]
    }

    Ensure all information is accurate, relevant to my specific issue, and follows proper legal citation format.`;

    // Make request to OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    // Extract content from the response
    const content = response.data.choices[0].message.content;
    
    // Try to parse the JSON response
    let caseData;
    try {
      // Handle cases where the response might contain text around the JSON
      let jsonContent = content;
      if (content.includes('{') && content.includes('}')) {
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}') + 1;
        jsonContent = content.substring(jsonStart, jsonEnd);
      }
      
      caseData = JSON.parse(jsonContent);
      
      // Validate the structure
      if (!caseData.cases || !Array.isArray(caseData.cases) || caseData.cases.length === 0) {
        throw new Error('Invalid response format from OpenAI');
      }
      
      // Return the formatted case data
      res.json(caseData);
      
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.error('Content that failed to parse:', content);
      res.status(500).json({ 
        error: 'Failed to parse OpenAI response as JSON',
        content: content 
      });
    }
    
  } catch (error) {
    console.error('Server error:', error);
    
    // Handle different types of errors
    if (error.response) {
      // OpenAI API error
      console.error('OpenAI API error:', error.response.data);
      res.status(error.response.status).json({ 
        error: 'Error from OpenAI API', 
        details: error.response.data 
      });
    } else if (error.request) {
      // Network error
      res.status(500).json({ 
        error: 'Network error when contacting OpenAI API' 
      });
    } else {
      // Other errors
      res.status(500).json({ 
        error: 'Server error', 
        message: error.message 
      });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
