Create a project based on Typescript, React, Redux, Vite, tailwindcss that is designed to work with Gemini API.

Requirements:

Follow SOLID and other good practices.

Aim for modularity.

Create the Gemini API client: 
    3.1 It must support async requests and / or request batching 
    3.2 It must allow to configure requests (e. g., to pass JSON-schema as generationConfig, pass different prompts, pass additional files as context (images, PDF, text), prefix and postfix texts for the prompt). 
    3.3 It must be reusable

Design the Web-interface: 
    4.1 It must be Typescript + React SPA. 
    4.2 It must be simple, but neat and practical. 
    4.3 The purpose of the web-interface is to take the prompt + an image or PDF as the input and fire a request to Gemini API. The image or PDF is the additional context and the prompt is the main payload. This must be the prompting panel. 
    4.4 The result of Gemini API must be rendered in the area next to the prompting panel (to the right of it). The result can be in Markdown, so the rendering panel must be able to render Markdown. 
    4.5 Aim for good UI proportions: a separation line in the center of the screen ~75% of hte screen height, near-white background, API key configuration panel at the bottom center, prompting panel on the left-center side of the screen and the rendering panel is on the right-center of the screen.

But first, create an execution plan that dictates you to give output as not more than 3 files at a time (create, update, delete, etc.). Make sure you clearly separate those files and not generating a single big file with concatenated other files.

Then execute a step from this plan. After each step of execution you must ask to continue. Upon my allowance, proceed further with the next step of the execution plan, and wait for confirmation again. Then we will repeat this until the project is done.