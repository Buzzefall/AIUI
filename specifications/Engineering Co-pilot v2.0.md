# Engineering Co-pilot v2.0: System Specification

## 1. Introduction

This document outlines the requirements for **Engineering Co-pilot v2.0**. The project evolves from the initial **Gemini API Client v1.0** into a comprehensive, interactive, and agentic assistant for engineering tasks. The core paradigm shifts from a linear chat interface to a project-based, multi-modal canvas, transforming the tool into a proactive co-pilot for design, analysis, and development.

## 2. Core Principles

*   **From Dialogue to Design Space:** The user interaction model will transcend simple text-based dialogue. The application will provide a persistent, project-based "canvas" where AI, users, and technical documents can coexist and interact.
*   **From Chatbot to Agent:** The AI will evolve from a passive respondent to a proactive agent. It will be equipped with tools to perform complex, multi-step tasks, such as code analysis, test generation, and diagramming.
*   **From Isolation to Collaboration:** The system will support shared workspaces, allowing engineering teams to collaborate on complex problems with the AI as a central participant.

## 3. Functional Requirements

### 3.1. The Infinite Canvas Interface

The single-dialogue view of v1.0 is deprecated. It will be replaced by an "Infinite Canvas".

*   **3.1.1. Multi-modal Objects:** Users can place, arrange, and resize various object types on the canvas:
    *   **Dialogue Panels:** Traditional chat interfaces with the AI.
    *   **Document Previews:** Rendered views of uploaded files (PDFs, source code, images, technical diagrams).
    *   **Editable Notes:** Rich-text scratchpads for user annotations.
    *   **AI-Generated Artifacts:** Diagrams, charts, and tables created by the AI.
*   **3.1.2. Contextual Connections:** Users can draw visual connections between objects on the canvas. The AI will interpret these connections as contextual links when formulating responses (e.g., linking a bug report note to a specific source code file).

### 3.2. Agentic AI & Tooling Framework

The AI's capabilities will be extended through a formal tooling framework.

*   **3.2.1. Tool Belt:** The AI will have access to a "tool belt" of capabilities that it can invoke to fulfill user requests. Initial tools will include:
    *   **Code Interpreter:** Executes Python code in a sandboxed environment for data analysis and computation.
    *   **Unit Test Generator:** Analyzes a source code file and generates a corresponding test suite (e.g., using Jest, pytest).
    *   **Diagram Generator:** Creates diagrams from textual descriptions (e.g., using Mermaid.js for flowcharts, sequence diagrams).
*   **3.2.2. Agentic Workflow Engine:** The system will support multi-step AI workflows. The user can assign a high-level goal, and the AI can autonomously chain multiple tool calls to achieve it (e.g., "Analyze the performance of `module.py`, identify bottlenecks, and suggest refactorings.").

### 3.3. Project-Based Workspaces

*   **3.3.1. Persistent Projects:** All work will be organized within "Projects". A project saves the state of the canvas, its objects, and the complete dialogue history.
*   **3.3.2. Project Explorer:** A file-tree-like interface will allow users to manage their projects and switch between them.

### 3.4. Collaborative Features

*   **3.4.1. Shared Projects:** Users can invite team members to a project.
*   **3.4.2. Real-time Synchronization:** All participants in a shared project will see updates to the canvas and dialogues in real-time.
*   **3.4.3. User Presence:** Avatars of currently active users will be visible within a shared project.

## 4. Non-Functional Requirements

### 4.1. System Architecture

*   **4.1.1. Frontend:** A React/TypeScript SPA, evolving from the v1.0 codebase. It will incorporate a canvas library (e.g., `react-flow` or equivalent) to implement the design space.
*   **4.1.2. Backend:** A lightweight backend service (e.g., Node.js/Express or Python/FastAPI) is now required to manage:
    *   User authentication and sessions.
    *   Project state persistence.
    *   Real-time collaboration (via WebSockets).
    *   Orchestration and execution of AI tool use.
*   **4.1.3. Modularity:** The principles of SOLID and modular design from v1.0 must be maintained and extended. The backend, frontend, and AI agent/tooling framework should be loosely coupled modules.

### 4.2. Performance

*   The canvas interface must remain responsive and fluid, even with a large number of objects.
*   Real-time collaboration updates should have minimal latency.
