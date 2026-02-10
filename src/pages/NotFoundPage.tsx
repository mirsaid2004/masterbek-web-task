import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video with Blur/Overlay */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover"
          src="/videos/idle.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* 404 Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Error Badge */}
        <div className="mb-8 flex items-center gap-2 bg-red-500/20 backdrop-blur-md px-6 py-3 rounded-full border border-red-500/30">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-400 font-semibold text-sm tracking-wider">
            ERROR
          </span>
        </div>

        {/* Error Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 max-w-2xl w-full border border-white/20 shadow-2xl text-center">
          {/* 404 Number */}
          <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
            404
          </h1>

          {/* Error Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Page Not Found
          </h2>

          {/* Error Message */}
          <p className="text-white/80 text-lg mb-8">
            "Oops! This page doesn't exist. Let me guide you back home..."
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoHome}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold text-lg py-4 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Go Home
            </button>

            <button
              onClick={() => navigate("/chat")}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-lg py-4 px-8 rounded-full border border-white/20 shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
              Start Chat
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-white/60 hover:text-white text-sm underline transition-colors"
            >
              ← Go Back
            </button>
            <span className="text-white/30">|</span>
            <button
              onClick={handleGoHome}
              className="text-white/60 hover:text-white text-sm underline transition-colors"
            >
              Main Page
            </button>
          </div>
        </div>

        {/* Fun Message */}
        <div className="mt-8 text-white/50 text-sm max-w-md text-center">
          <p className="italic">
            "Even I get lost sometimes, Master... but I'm here to help you find
            your way!"
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
