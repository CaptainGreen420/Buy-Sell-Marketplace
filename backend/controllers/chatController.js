import { GoogleGenerativeAI } from "@google/generative-ai";

const validateEnvironment = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        const error = new Error('GEMINI_API_KEY environment variable is missing');
        error.status = 400;
        throw error;
    }
    return apiKey;
};

const validateRequest = (message, history) => {
    if (!message) {
        throw new Error('Message is required');
    }
    if (!history || !Array.isArray(history)) {
        throw new Error('History must be an array');
    }
};

const formatChatHistory = (message, history) => {
    let chatHistory = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
    }));

    // Ensure the very first message in history is from 'user'
    if (chatHistory.length > 0 && chatHistory[0].role !== 'user') {
        chatHistory.unshift({
            role: 'user',
            parts: [{ text: message }]
        });
    }

    return chatHistory;
};

const initializeChat = (genAI, chatHistory) => {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-pro",
        generationConfig: {
            maxOutputTokens: 2048,
        }
    });

    return model.startChat({
        history: chatHistory,
        generationConfig: {
            maxOutputTokens: 2048,
        },
    });
};

export const chat = async (req, res) => {
    try {
        console.log('GEMINI_API_KEY value:', process.env.GEMINI_API_KEY); // Debug environment variable
        console.log('Incoming request data:', req.body); // Debug request body

        const apiKey = validateEnvironment();
        const genAI = new GoogleGenerativeAI(apiKey);

        const { message, history } = req.body;

        validateRequest(message, history);
        console.log('Validated request, message and history:', message, history); // Debug log

        const chatHistory = formatChatHistory(message, history);

        const chat = initializeChat(genAI, chatHistory);
        
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        console.log(chatHistory); // Debug chat history

        res.json({
            success: true,
            message: text,
            history: chatHistory
        });

    } catch (error) {
        console.error('Chat error debug with stack:', error.stack);
        console.error('Chat error debug:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });

        const statusCode = error.status || 500;
        const errorMessage = error.status === 400 
            ? 'Invalid API configuration or request'
            : 'Error processing chat request';

        res.status(statusCode).json({
            success: false,
            message: errorMessage,
            error: error.message
        });
    }
};