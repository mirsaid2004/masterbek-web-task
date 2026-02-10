# Virtual Video Chat Simulator

A seamless video conversation application with an anime character using React, TypeScript, Tailwind CSS, and React Router. Features a sophisticated state machine, double-buffering video system, and beautiful glassmorphic UI.

## 🎯 Core Features

### 1. **Two-Page Architecture with React Router**

- **Hero/Landing Page (`/`)**: Beautiful entry point with looping idle video, blur overlay, and "Start Conversation" button
- **Theater Chat Page (`/chat`)**: Full-screen immersive chat experience with dual-buffer video system

### 2. **Double Buffering for Seamless Video Transitions**

The application uses two `<video>` elements (Primary and Buffer) that swap opacity to ensure zero-gap transitions between video states. When a state changes, the new video is preloaded in the hidden buffer, and once ready (`onCanPlayThrough`), the videos swap with a smooth 500ms fade transition.

### 3. **State Machine Architecture**

Implements a predictable flow with 8 distinct states:

- **IDLE**: Initial state with looping idle animation (Hero Page only)
- **GREETING**: Welcome message when chat starts
- **LISTENING**: Actively listening for user speech (8s timeout)
- **WEATHER**: Response to weather-related queries
- **GENERAL**: Generic response to other queries
- **GOODBYE**: Farewell message (returns to Hero Page)
- **FALLBACK**: Error handling state
- **PROMPT**: Triggered after 8 seconds of silence

### 4. **Speech Recognition Integration**

- Uses `webkitSpeechRecognition` API for voice input
- Keyword detection: "weather", "today", "bye", "goodbye", "hello"
- Automatic state transitions based on detected keywords
- Error handling with fallback state

### 5. **Glassmorphic Theater UI**

Inspired by modern video conferencing apps with anime aesthetic:

- **Top Bar**: Character name badge (HANA • LIVE), settings, camera toggle, volume control, exit button
- **Bottom Status Bubble**: Shows current state and user transcript
- **Microphone Indicator**: Animated red pulsing ring with "ACTIVE" label when listening
- **All UI elements**: Semi-transparent with backdrop blur to keep video as the star

### 6. **Bonus Features Implemented**

- **User Gesture Requirement**: Mic permissions only requested after "Start Conversation" click
- **Silence Detection**: 8-second timer in LISTENING state triggers PROMPT video
- **Transcript UI**: Glassmorphic bubble displaying user speech at bottom center
- **Mic Feedback**: Animated pulsing red ring when actively listening
- **Video Preloading**: All videos cached on page load for instant playback
- **Mobile Support**: `playsInline` attribute for iOS compatibility
- **Smooth Navigation**: Exit button triggers GOODBYE video before returning to hero page

## 🚀 Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- Modern browser with Speech Recognition support (Chrome, Edge, Safari)

### Installation

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Setup Video Assets**
   All videos should be in `public/videos/`:

   ```
   public/
     videos/
       idle.mp4           # Looping background for hero page
       greeting.mp4       # Welcome message
       listening.mp4      # Looping animation while listening
       weather.mp4        # Weather response
       general_response.mp4  # Generic response
       goodbye.mp4        # Farewell message
       fallback.mp4       # Error handling
       prompt.mp4         # Silence timeout prompt
   ```

3. **Run Development Server**

   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
src/
├── App.tsx                          # Router setup
├── types.ts                         # TypeScript types & video mappings
├── pages/
│   ├── HeroPage.tsx                # Landing page with idle video
│   └── ChatPage.tsx                # Theater-style chat page
├── hooks/
│   └── useSpeechRecognition.ts     # Speech recognition hook
├── App.css                          # Component styles
└── index.css                        # Global styles with Tailwind
```

## 🎮 Usage Flow

1. **Visit Site**: Hero page shows with looping IDLE video and glassmorphic welcome card
2. **Click "Start Conversation"**: Navigates to `/chat` and triggers mic permissions
3. **Greeting Plays**: Automatically transitions to GREETING state
4. **After Greeting**: Moves to LISTENING state (red mic indicator appears)
5. **User Speaks**:
   - "weather" or "today" → WEATHER state
   - "bye" or "goodbye" → GOODBYE state → returns to hero page
   - Other speech → GENERAL state
6. **After Response**: Returns to LISTENING state
7. **8s Silence**: Triggers PROMPT state ("Are you still there?"), then back to LISTENING
8. **Click Exit (X)**: Triggers GOODBYE video, then returns to hero page

## 🔧 Technical Implementation

### React Router Structure

```typescript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<HeroPage />} /> // Idle entry
    <Route path="/chat" element={<ChatPage />} /> // Theater mode
  </Routes>
</BrowserRouter>
```

### Dual-Buffer Video System

```typescript
// Two video elements with opacity swapping
<video ref={primaryVideoRef} className={isPrimaryVisible ? 'opacity-100' : 'opacity-0'} />
<video ref={bufferVideoRef} className={!isPrimaryVisible ? 'opacity-100' : 'opacity-0'} />
```

### State Machine Logic

```typescript
// State transitions based on video end events
handleVideoEnd() {
  if (state === 'GREETING' || state === 'RESPONSE') → 'LISTENING'
  if (state === 'GOODBYE') → navigate('/')
}
```

### Keyword Matching

```typescript
if (transcript.includes('weather')) → 'WEATHER'
if (transcript.includes('bye')) → 'GOODBYE'
else → 'GENERAL'
```

## 📱 Mobile Considerations

- All videos include `playsInline` attribute for iOS compatibility
- Hero page idle video is muted to allow autoplay on mobile browsers
- Responsive UI with Tailwind CSS utilities
- Touch-friendly buttons with proper sizing (minimum 44x44px)

## 🎨 UI Components

### Hero Page

1. **Idle Video Background**: Full-screen with blur overlay
2. **Character Badge**: "AIRI • LIVE" with green pulse indicator
3. **Welcome Card**: Glassmorphic design with gradient button
4. **Feature Pills**: Voice Recognition, HD Audio, Real-time AI
5. **Top-Right Controls**: Dark mode toggle, settings button

### Chat Page (Theater Mode)

1. **Top Bar**: Character badge, settings, camera, volume, exit (X)
2. **Status Bubble**: Center-bottom showing current state and transcript
3. **Mic Indicator**: Bottom-right with pulsing red animation and "ACTIVE" label
4. **All UI**: Glassmorphic (black/30 backdrop-blur-md) to keep video prominent

## 🔍 Browser Compatibility

- **Chrome/Edge**: Full support with `webkitSpeechRecognition`
- **Safari**: Supports Speech Recognition API
- **Firefox**: Limited speech recognition support
- **Mobile**: iOS Safari and Chrome Android supported

## 🛠️ Customization

### Adding New States

1. Add state to `AppState` type in `types.ts`
2. Add video path to `VIDEO_FILES` object
3. Update state machine logic in `ChatPage.tsx`
4. Add status text in the status bubble section

### Changing Keywords

Modify the keyword detection in `useSpeechRecognition.ts`:

```typescript
if (transcript.includes("your-keyword")) {
  onMatch("YOUR_STATE");
}
```

### Adjusting Silence Timer

Change the timeout value in `ChatPage.tsx`:

```typescript
setTimeout(() => setState("PROMPT"), 8000); // Change 8000 to desired ms
```

### Customizing UI Colors

Update the Tailwind classes in `HeroPage.tsx` or `ChatPage.tsx`:

```typescript
// Example: Change button gradient
className = "bg-gradient-to-r from-purple-400 to-pink-500";
```

## 📝 Complete Feature Checklist

- [x] React Router with two-page architecture
- [x] Beautiful hero/landing page with idle video
- [x] Theater-style chat page with full-screen video
- [x] Tailwind CSS configured and integrated
- [x] Double-buffer video system implemented
- [x] State machine with 8 states
- [x] Speech recognition with keyword detection
- [x] 8-second silence detection
- [x] Glassmorphic transcript UI
- [x] Animated microphone indicator with "ACTIVE" label
- [x] Video preloading on mount
- [x] Mobile support (`playsInline`)
- [x] User gesture requirement (click to start)
- [x] Exit button triggers goodbye sequence
- [x] Smooth navigation between pages
- [x] Top bar with character name and controls
- [x] All videos in place (including easter_egg.mp4!)

## 🎓 Senior Developer Insights

This project demonstrates several advanced frontend patterns:

1. **Routing for User Flow**: Separates the "entry experience" from the "active experience" using React Router, providing clear mental models for users.

2. **Double Buffering**: Borrowed from game development, this technique ensures frame-perfect transitions by preparing the next frame before displaying it.

3. **Finite State Machine**: Provides predictable, testable behavior by explicitly defining all possible states and transitions.

4. **Separation of Concerns**: Custom hooks isolate speech recognition logic, pages handle routing/navigation, making the codebase maintainable.

5. **Defensive Programming**: Extensive error handling, browser compatibility checks, cleanup functions prevent memory leaks, and user gesture requirements for media APIs.

6. **Performance Optimization**: Video preloading, efficient re-renders with `useCallback`, and CSS transitions offloaded to GPU for 60fps animations.

7. **Glassmorphism Design**: Modern UI trend using backdrop-blur-md and transparency to create depth while keeping the video content prominent.

## 🎥 Video Requirements

All video files must be:

- Format: MP4 (H.264 codec recommended)
- Resolution: 1080p or higher for best quality
- FPS: 24-30 fps
- Audio: AAC codec (for greeting, weather, general, goodbye, fallback, prompt)
- Looping videos: idle.mp4 and listening.mp4 should be seamless loops

## 📄 License

MIT

## 👨‍💻 Author

Built with modern React best practices, attention to UX details, and anime aesthetic in mind.
