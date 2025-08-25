# Transformation Path to v2.0

The path from v1.0 to v2.0 is a journey of architectural and conceptual transformation. It prioritizes a minimally viable, seamless transition of existing functionality to a new, extensible architecture. It unfolds in phases, each building upon the last, to evolve the simple client into a collaborative co-pilot.

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

### **Phase 3: Stubbing the Agentic Core**

To enable a seamless transition, this phase focuses on creating the necessary interfaces (stubs) for the future agentic capabilities without implementing their full complexity.

*   **3.1. Define the Tooling API Contract:** Design the API endpoints and data structures for how the frontend will eventually request agentic actions.
*   **3.2. Implement Backend Stubs:** The backend will expose these new endpoints, but they will initially contain placeholder logic that gracefully falls back to the existing v1.0 chat functionality.
*   **3.3. Integrate Frontend Hooks:** The new canvas UI will be wired to these stubbed endpoints, ensuring the user-facing controls are in place and functional.

### **Phase 4: Integration & Functionality Preservation**

This is where the separate streams of development converge. The goal is to have the new v2.0 architecture running with the preserved v1.0 feature set.

*   **4.1. Connect Frontend to Backend:** The canvas UI (Phase 2) will be fully integrated with the backend (Phase 1).
*   **4.2. Activate Core Functionality via Stubs:** The existing chat functionality will now operate through the new UI, powered by the stubbed agentic APIs (Phase 3).
*   **4.3. Deprecate v1.0 Components:** The original dual-panel layout and its components will be fully decommissioned, completing the architectural migration.

### **Future Extensions**

The v2.0 architecture is designed to be a foundation. The following key features, while not part of the initial v2.0 scope, are anticipated and can be built upon the new foundation:

*   **Full Agentic Core:** Replacing the stubs with a complete implementation of the orchestration engine and tools (e.g., Code Interpreter, Diagram Generator).
*   **Real-Time Collaboration:** Integrating WebSockets to synchronize the project state across multiple clients in real-time.
*   **Presence Indicators:** Adding UI elements to show which users are active in a shared project.

This path prioritizes a stable and scalable evolution toward the full vision of the **Engineering Co-pilot**.
