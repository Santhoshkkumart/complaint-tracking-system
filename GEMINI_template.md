# GEMINI.md Template

This template provides a structured format for documenting projects for the Gemini CLI, ensuring key information is easily accessible for future interactions and understanding.

---

## Project Overview

*A clear and concise summary of the project's purpose, main goals, and a high-level description of what it does.*

- **Purpose:** [Briefly describe the primary objective of the project.]
- **Key Features:** [List the most important functionalities or aspects of the project.]
- **High-Level Architecture:** [Describe the overall structure or design if applicable, e.g., "Client-server model," "Monolithic application," "Microservices based."]

---

## Tech Stack (For Code Projects)

*Outline the core technologies, languages, frameworks, and tools used in the project.*

### Frontend:
- [Language/Framework 1]: [Brief description of its role]
- [Library/Tool 1]: [Brief description of its role]

### Backend:
- [Language/Framework 1]: [Brief description of its role]
- [Database/Data Store]: [Type and brief description]
- [API Framework/Library]: [Brief description of its role]

### Deployment & Infrastructure:
- [Cloud Provider/Hosting]: [e.g., AWS, Azure, Google Cloud, Firebase]
- [CI/CD Tools]: [e.g., GitHub Actions, Jenkins, GitLab CI]
- [Containerization/Orchestration]: [e.g., Docker, Kubernetes]

---

## Building and Running (For Code Projects)

*Document the essential commands and steps required to set up, build, run, and test the project.*

### 1. Prerequisites:
- [List any necessary software or tools, e.g., Node.js, Python, Docker, specific SDK versions.]

### 2. Installation:
```bash
# Clone the repository
git clone [repository_url]
cd [project_directory]

# Install dependencies
[command to install dependencies, e.g., npm install, pip install -r requirements.txt]
```

### 3. Configuration (if applicable):
- [Instructions for environment variables, config files, or API keys. Emphasize security best practices.]

### 4. Running the Development Server:
```bash
[command to start development server, e.g., npm run dev, python app.py, go run main.go]
```
- [Expected access URL, e.g., "Accessible at `http://localhost:3000`"]

### 5. Running Tests:
```bash
[command to run tests, e.g., npm test, pytest, go test ./...]
```

### 6. Building for Production:
```bash
[command to build production assets, e.g., npm run build, webpack]
```

---

## Development Conventions

*Describe any specific coding standards, architectural patterns, testing practices, or project structure guidelines.*

- **Code Style:** [e.g., ESLint, Prettier, Black, Go fmt]
- **Project Structure:** [e.g., "Features are organized by domain," "Monorepo structure"]
- **Testing Philosophy:** [e.g., "Unit tests for all core logic," "Integration tests for API endpoints"]
- **Contribution Guidelines:** [Briefly mention if there's a specific process for contributing, e.g., pull requests, issue tracking.]

---

## Directory Overview (For Non-Code Projects)

*If this is primarily a documentation, data, or content repository, describe the structure and purpose of its main directories.*

- `/docs`: [Description, e.g., "Contains all project documentation and user guides."]
- `/data`: [Description, e.g., "Stores raw and processed datasets."]
- `/assets`: [Description, e.g., "Images, media, and other static assets."]
- `[file_name.md]`: [Briefly explain the content and purpose of key files.]

---

## Usage (For Non-Code Projects)

*Explain how the contents of this directory are intended to be used or consumed.*

- [Instructions on how to access, read, or utilize the information/files.]
- [Any specific tools required to view or process the content.]

---

## Additional Notes

- [Any other important information, known issues, future plans, or specific instructions for the Gemini CLI.]
