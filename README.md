# Data AI Assistant Ultra

See final product here: https://data-ai-assistant-ultra.vercel.app/

This is a web-based AI assistant powered by Google's Generative AI, designed to emulate the character and behavior of Lt. Cmdr. Data from Star Trek: The Next Generation.

## Getting Started

### Prerequisites

- Node.js and npm installed.
- A Google AI API key.
- A Firebase project with Firestore enabled.

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
5. Create a Firebase project (https://console.firebase.google.com/) and a web app within it.
6. In your Firebase project settings, find your web app's configuration object. It will look like this:
  ```javascript
  const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id",
    measurementId: "your-measurement-id"
  };
  ```
7. Add these values to your `.env` file, prefixing each with `VITE_`:
  ```
  VITE_FIREBASE_API_KEY=your-api-key
  VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
  VITE_FIREBASE_PROJECT_ID=your-project-id
  VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
  VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
  VITE_FIREBASE_APP_ID=your-app-id
  VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
  ```

### Running the Application

1. Start the development server:
   ```sh
   npm run dev
   ```
2. Open your browser and navigate to the URL provided by Vite.

The serverless function in `api/generate.js` will be automatically used by the frontend.

## Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run preview`: Serves the production build locally.

## Key Dependencies

- **React**: Frontend library for building user interfaces.
- **Vite**: Frontend build tool.
- **Express**: Backend framework for the server.
- **@google/genai**: Google's Generative AI SDK.
- **Firebase**: For authentication and database.
- **Marked**: For rendering Markdown.
- **DOMPurify**: For sanitizing HTML to prevent XSS attacks.
