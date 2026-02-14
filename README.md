# Virtual Video Chat Simulator

A seamless video conversation application with an anime character, built to demonstrate advanced frontend performance patterns. Features a sophisticated state machine, a custom double-buffered video engine with Blob caching, and a natural language voice interface.

## 🎯 Core Features & Tech Stack

### Technology Choices
-   **React + TypeScript**: For type-safe, component-based architecture.
-   **Vite**: For lightning-fast development and optimized build bundling.
-   **Tailwind CSS**: For utility-first, performant styling (Glassmorphism UI).
-   **React Router**: To manage the flow between the "Hero" entry and "Chat" theater modes.
-   **Web Speech API**: Native browser API for speech-to-text (no external keys required).

### 1. 🎥 Advanced Video Playback Strategy (The "Seamless" Secret)

Achieving gapless video playback on the web is notoriously difficult. We implemented a robust strategy to eliminate black screens and buffering delays:

#### A. Double Buffering Engine
Borrowed from game development, we use **two stacked `<video>` elements**:
-   **Primary**: Visible and playing.
-   **Buffer**: Hidden (using opacity 0), preloading the *next* video.
-   **The Swap**: When the state changes, the hidden buffer loads the new video. Once ready (`canplay`), we cross-fade opacities. The user never sees a loading spinner during conversation.

#### B. HTML5 Preload Strategy
To ensure videos are ready for instant playback:
1.  **DOM Preloading**: We create hidden `HTMLVideoElement` instances (`document.createElement('video')`) for each state.
2.  **Memory Cache**: These video elements are stored in a `Map` within our React Context.
3.  **Browser Caching**: By setting `preload="auto"`, the browser downloads and caches the video file. Since our videos are lightweight (3-10MB), this ensures they are available immediately without complex blob handling.

#### C. Race Condition Handling
We tracking pending video loads (`pendingVideosRef`) to prevent duplicate DOM elements or network requests if multiple components request the same video simultaneously.

### 2. 🗣️ Speech Integration & Logic

We use the `webkitSpeechRecognition` API for a natural voice interface.

#### Logic Flow
1.  **Listing Mode**: The character waits for input.
2.  **Confidence Check**: If recognition confidence is **< 0.7**, we trigger a **FALLBACK** ("I didn't quite catch that") state logic.
3.  **Keyword Matching**:
    -   "weather" / "today" → **WEATHER**
    -   "hello" / "hi" → **GREETING**
    -   "bye" / "goodbye" → **GOODBYE**
    -   "position" / "applying for" → **EASTER_EGG** 🐣
    -   *Everything else* → **GENERAL**

#### Silence Detection (Stateful)
We implement a "Two-Strike" rule for silence:
1.  **8 seconds silence**: Triggers **PROMPT** video ("Are you still there?").
2.  **Another 8 seconds**: Triggers **GOODBYE** video and ends the session.
3.  **Reset**: If the user speaks at any point, the counter resets.

### 3. mplemented vs. Stretch Goals

| Feature | Status | Implementation Detail |
| :--- | :--- | :--- |
| Seamless Video Switching | ✅ | Double Video Buffer + Opacity Fades |
| Zero-Latency Playback | ✅ | HTML5 Preload Strategy |
| Voice Recognition | ✅ | Web Speech API with keyword mapping |
| Mobile Support | ✅ | `playsInline` + Touch UI |
| Visual Feedback | ✅ | Pulsing Mic Indicator & Transcript Bubble |
| Silence Handling | ✅ | 8s Timeout with "Prompt" -> "Exit" flow |
| Easter Eggs | ✅ | Secret video triggered by specific phrases |
| LLM Integration | ⏳ | Future: Connect transcript to OpenAI/LLM |

### 4. Challenges & Solutions

#### 🔴 Challenge: The "Black Screen" Flash
**Problem**: When switching `src` on a single video element, the browser clears the frame, showing black for ~200ms.
**Solution**: **Double Buffering**. We keep the old video visible until the exact millisecond the new video emits `canplay`.

#### 🔴 Challenge: Duplicate Video Elements
**Problem**: The caching context was creating multiple `<video>` preloaders for the same file if `loadVideos` was called rapidly.
**Solution**: Implemented a `pendingVideosRef` set to track *in-flight* requests. If a video is currently fetching, subsequent requests wait for the existing promise.

#### 🔴 Challenge: Video Readiness
**Problem**: Playing a video before it has enough data causes buffering.
**Solution**: We use the `canplaythrough` event on our preloaded video elements to confirm they are ready before adding them to the cache map.

## 🚀 Setup Instructions

### Prerequisites
-   Node.js 16+
-   Modern Browser (Chrome/Edge/Safari recommended for Speech API)

### Steps
1.  **Install Dependencies**
    ```bash
    npm install
    # or
    pnpm install
    ```

2.  **Add Video Assets**
    Ensure `public/videos/` contains:
    - `idle.mp4`, `greeting.mp4`, `listening.mp4`
    - `weather.mp4`, `general_response.mp4`, `goodbye.mp4`
    - `fallback.mp4`, `prompt.mp4`, `easter_egg.mp4`

3.  **Run Locally**
    ```bash
    npm run dev
    ```

4.  **Build**
    ```bash
    npm run build
    ```

## 🔮 Future Improvements

-   **Generative AI**: Hook the transcription into an LLM (ChatGPT/Claude) to generate dynamic text, then use a TTS (Text-to-Speech) service to lip-sync the avatar.
-   **Audio Visualizer**: Real-time waveform visualization of the user's voice.
-   **PWA Support**: Make installable on mobile devices.

---

**Author**: M_DEV
