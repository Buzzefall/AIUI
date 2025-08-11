# Transformation Path to v2.0

The path from v1.0 to v2.0 is a journey of architectural and conceptual transformation. It unfolds in phases, each building upon the last, to evolve the simple client into a collaborative co-pilot.

Here is the high-level view of that path:

### **Phase 1: Foundational Backend & Project Structure**

The first step is to lay the new foundation that v2.0 requires. The current client-only architecture must be expanded.

*   **1.1. Establish the Server:** Introduce a lightweight backend (e.g., Node.js with Express or Python with FastAPI) to serve as the system's new central nervous system.
*   **1.2. Implement Project Persistence:** Create the database schema and API endpoints for managing "Projects". This is the core container for all user work, storing dialogue history, file references, and canvas layouts.
*   **1.3. Introduce User Sessions:** Implement basic user authentication to enable the concept of ownership and future collaboration.

### **Phase 2: The Infinite Canvas User Interface**

With the backend in place, the user experience can be transformed. This phase focuses exclusively on building the new frontend paradigm.

*   **2.1. Replace the Static View:** Deprecate the v1.0 dual-panel layout. Integrate a canvas library (e.g., `react-flow`) to create the new, unbounded workspace.
*   **2.2. Develop Canvas Primitives:** Implement the core interactions: creating, moving, resizing, and deleting fundamental objects like Dialogue Panels and Note Panels.
*   **2.3. Integrate File Objects:** Enable the uploading and rendering of external documents (PDFs, source code, images) as objects on the canvas, making them part of the persistent project state.

### **Phase 3: The Agentic Core & Tooling Framework**

This phase gives the AI its new capabilities. It can be developed in parallel with the frontend work.

*   **3.1. Design the Tooling API:** Define a clear, extensible contract between the backend and the AI for how "tools" are described, invoked, and how their results are returned.
*   **3.2. Build the Orchestration Engine:** The backend must be taught how to manage multi-step agentic workflows, chaining tool calls and maintaining context to achieve higher-level user goals.
*   **3.3. Implement Initial Tools:** Develop the first set of specified tools (e.g., Code Interpreter, Diagram Generator) as sandboxed, modular components.

### **Phase 4: Integration, Collaboration, and Synthesis**

This is where the separate streams of development converge and the collaborative aspect is enabled.

*   **4.1. Connect Frontend to Agent:** The frontend canvas must be able to initiate agentic workflows and render the results—including AI-generated artifacts like diagrams—back onto the canvas.
*   **4.2. Enable Real-Time Collaboration:** Integrate WebSockets to synchronize the project state across multiple clients in real-time, enabling shared workspaces.
*   **4.3. Implement Presence Indicators:** Add the UI elements to show which users are active in a shared project.

This path prioritizes building the fundamental architectural layers first, allowing for a stable and scalable evolution toward the full vision of the Engineering Co-pilot.
