# Taseen's Caselaw Search

A web application that helps lawyers find relevant case law based on legal issues they're facing, powered by AI.

## Live Demo

Check out the live demo: [https://taseenanwar.github.io/Caselaw/frontend/](https://taseenanwar.github.io/Caselaw/frontend/)

## Project Structure

This project is organized into two main components:

### Frontend

The client-side web application that users interact with. Located in the `frontend/` directory.

- `index.html` - The main HTML structure
- `styles.css` - CSS styling for the application
- `script.js` - JavaScript that handles user interaction and API communication

### Backend

The server-side application that securely communicates with the OpenAI API. Located in the `backend/` directory.

- `server.js` - Express.js server that handles API requests
- `package.json` - Node.js dependencies
- `.env` - Environment variables (not committed to GitHub)

## Setup Instructions

### Frontend Setup

1. Clone this repository:
   ```
   git clone https://github.com/TaseenAnwar/Caselaw.git
   cd Caselaw
   ```

2. The frontend is ready to use and can be opened directly in a browser:
   ```
   open frontend/index.html
   ```

3. For local development with the backend, make sure the `backendUrl` in `script.js` is set to `http://localhost:3000` (or your local server port).

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   ```

4. Start the server:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

## Usage

1. Enter your legal issue details in the form
2. Specify the jurisdiction and areas of law
3. Click "Find Relevant Cases"
4. View the top relevant cases with summaries and citations

## Deployment

### Frontend Deployment

The frontend is currently deployed on GitHub Pages at [https://taseenanwar.github.io/Caselaw/frontend/](https://taseenanwar.github.io/Caselaw/frontend/)

### Backend Deployment Options

The backend can be deployed to various platforms:

- **Heroku**
- **Vercel**
- **Netlify Functions**
- **AWS Lambda**
- **DigitalOcean App Platform**

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
