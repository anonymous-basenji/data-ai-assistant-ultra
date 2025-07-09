# Data AI Assistant Ultra

This is a web-based AI assistant powered by Google's Generative AI, designed to emulate the character and behavior of Lt. Cmdr. Data from Star Trek: The Next Generation.

## Getting Started

### Prerequisites

- Node.js and npm installed.
- A Google AI API key.

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/anonymous-basenji/data-ai-assistant-ultra.git
   ```
2. Navigate to the project directory:
   ```sh
   cd data-ai-assistant-ultra
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```
4. Create a `.env` file in the root directory and add your Google AI API key (get it here, it's free: https://aistudio.google.com/app/apikey):
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

### Running the Application

1. Start the server:
   ```sh
   node src/server.js
   ```
2. In a separate terminal, start the development server:
   ```sh
   npm run dev
   ```
3. Open your browser and navigate to the URL provided by Vite.

## Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run preview`: Serves the production build locally.


## Key Dependencies

- **React**: Frontend library for building user interfaces.
- **Vite**: Frontend build tool.
- **Express**: Backend framework for the server.
- **@google/genai**: Google's newest Generative AI SDK.
- **Marked**: For rendering Markdown.
- **DOMPurify**: For sanitizing HTML to prevent XSS attacks.
