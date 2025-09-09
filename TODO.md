# Project TODO List

This document tracks the required tasks for the Engineering Co-Pilot application. It is divided into short-term fixes for the current implementation and long-term features required to fulfill the v2.0 vision.

## 🎯 Short-Term Fixes & v1.5 Features

These tasks address issues in the current (v1.5) implementation and add smaller, requested features.

- [x] **Integrate API Errors into Chat History:**
  - **Completed:** Errors from the API are now captured and displayed inline in the chat history. The user message that triggered the error is preserved, and the error message itself includes the `FinishReason` from the API for better diagnostics. Error messages are styled distinctly to be noticeable.
  - **Completed:** Added a "Troubleshooting Mode" toggle. When disabled (default), user/error message pairs are excluded from the history sent to the API, preventing the model from getting confused by its own past failures.
  - **Completed:** Implemented a data migration to seamlessly update users with older chat histories stored in `localStorage` to the new data structure.

- [x] **Preserve UI State on API Failure:**
  - **Problem:** The prompt text and attached files in the `PromptingPanel` are cleared immediately after an API call is sent, even if it fails.
  - **Solution:** Refactor the `handleSubmit` function in `PromptingPanel.tsx`. The `generateContentThunk` dispatch should be checked for success or failure. Only clear the prompt and file inputs if the API call was successful.

- [ ] **Implement Model Selection (Flash vs. Pro):**
  - **Problem:** The Gemini model (`gemini-2.5-pro-latest`) is hardcoded in `geminiApiClient.ts`.
  - **Solution:**
    1.  Add a `model` field to `settingsSlice`.
    2.  Create a new UI component (e.g., `ModelSelectorPanel`) with a dropdown or toggle, and add it to the `ControlPanel`.
    3.  Update `geminiApiClient.ts` to accept the model name in its constructor or `generateContent` method.
    4.  Pass the selected model from the state to the API client when `generateContent` is called.

- [x] **Implement Chat Message Editing:**
  - **Completed:** Implemented message selection (in pairs), deletion via a context menu with a confirmation dialog, and a "Resend" option for the last model message. The underlying data model was refactored to use an explicit `responseTo` property for robust message pairing.
  - **Goal:** Allow users to select, edit, and delete messages directly from the chat history.
  - **Requirements:**
    1.  **Selection:**
        - Messages must be selectable.
        - Selection must occur in user/model message pairs to maintain history integrity.
    2.  **Context Menu (Right-Click):**
        - **Edit (Last User Message):** Enters an edit mode for the message. Must be confirmed (re-sends prompt) or discarded.
        - **Resend (Last Model Message):** Re-sends the prompt that generated this response, replacing the old response with the new one.
        - **Delete (Any Message):**
          - Shows "Delete Selected" if multiple pairs are selected.
          - Shows "Delete" if only the right-clicked pair is targeted.
          - Must be confirmed by the user.

## 🚀 v2.0 Core Features

These are major, high-level features that represent the core of the **Engineering Co-Pilot** (v2.0 specification of the application). Each of these will likely need to be broken down into smaller epics and tasks.

- [ ] **Architect the "Infinite Canvas" Interface:**
  - **Goal:** Replace the linear, single-dialogue view with a persistent, project-based "infinite canvas".
  - **Key Components:** Multi-modal objects (dialogue panels, document previews, notes), contextual connections between objects.
  - **Tech:** Requires integrating a canvas library like `react-flow` or similar.

- [ ] **Develop the Agentic AI & Tooling Framework:**
  - **Goal:** Evolve the AI from a passive respondent to a proactive agent with a "tool belt".
  - **Key Components:** Backend framework for defining and executing tools (Code Interpreter, Unit Test Generator, Diagram Generator), and a workflow engine to chain tool calls.

- [x] **Implement Project-Based Workspaces:**
  - **Goal:** Organize all work within persistent, savable "Projects".
  - **Completed:** 
    1. Backend service implemented with FastAPI and MongoDB, providing full CRUD functionality for projects and user authentication.
  - **Next Steps:** Requires a "Project Explorer" UI on the frontend to interact with the backend.

- [ ] **Enable Real-Time Collaboration:**
  - **Goal:** Allow multiple users to collaborate in a shared project workspace.
  - **Key Components:** Backend WebSocket implementation for real-time synchronization, frontend logic to handle and display live updates, user presence indicators.