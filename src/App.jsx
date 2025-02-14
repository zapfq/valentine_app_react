import { useState, useEffect, useCallback } from 'react';
import { Heart, Volume2, VolumeX } from 'lucide-react';

const useAudio = (url) => {
  const [audio] = useState(new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'));
  const [playing, setPlaying] = useState(false);

  const toggle = useCallback(() => setPlaying(!playing), [playing]);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing, audio]);

  useEffect(() => {
    audio.addEventListener('ended', () => audio.play());
    return () => {
      audio.removeEventListener('ended', () => audio.play());
      audio.pause();
    };
  }, [audio]);

  return [playing, toggle];
};

const FloatingHeart = ({ style }) => {
  return (
    <div 
      className="absolute animate-float"
      style={style}
    >
      <Heart 
        className="text-pink-500 animate-pulse"
        fill="currentColor"
        size={24}
      />
    </div>
  );
};

export default function ValentineApp() {
  const [name, setName] = useState('');
  const [showGreeting, setShowGreeting] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [playing, toggle] = useAudio();

  // Generate random hearts
  useEffect(() => {
    const interval = setInterval(() => {
      if (hearts.length < 15) {
        const newHeart = {
          id: Math.random(),
          left: `${Math.random() * 90}%`,
          animationDuration: `${5 + Math.random() * 5}s`,
          scale: 0.5 + Math.random() * 1
        };
        setHearts(prev => [...prev, newHeart]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hearts]);

  // Remove hearts that have floated away
  useEffect(() => {
    const interval = setInterval(() => {
      setHearts(prev => prev.slice(1));
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const showValentine = () => {
    const valentineMessages = [
      `Dear ${name || 'Friend'},`,
      "🌹 On this special Valentine's Day 🌹",
      "May your heart be filled with joy,",
      "love, and wonderful moments!",
      "Happy Valentine's Day! ❤️"
    ];

    setShowGreeting(true);
    setMessages([]);

    valentineMessages.forEach((message, index) => {
      setTimeout(() => {
        setMessages(prev => [...prev, message]);
      }, index * 1000);
    });
  };

  const reset = () => {
    setShowGreeting(false);
    setName('');
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Floating Hearts Background */}
      {hearts.map(heart => (
        <FloatingHeart
          key={heart.id}
          style={{
            left: heart.left,
            animationDuration: heart.animationDuration,
            transform: `scale(${heart.scale})`
          }}
        />
      ))}

      {/* Main Content */}
      <div className="z-10 w-full max-w-md p-8 rounded-lg bg-white/80 backdrop-blur-sm shadow-xl">
        {!showGreeting ? (
          <div className="space-y-6 text-center">
            <h1 className="text-3xl font-bold text-pink-600">
              ✨ Welcome! ✨
            </h1>
            <div className="space-y-4">
              <label className="block text-lg text-gray-700">
                Please enter your name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                placeholder="Your name"
              />
              <button
                onClick={showValentine}
                className="w-full py-3 px-6 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
              >
                Send Valentine ❤️
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            {messages.map((message, index) => (
              <p
                key={index}
                className="text-lg text-gray-800 animate-fade-in"
              >
                {message}
              </p>
            ))}
            {messages.length === 5 && (
              <button
                onClick={reset}
                className="mt-6 py-3 px-6 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
              >
                Send Another Valentine ❤️
              </button>
            )}
          </div>
        )}
      </div>

      {/* Music Control */}
      <button
        onClick={toggle}
        className="fixed bottom-4 right-4 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100"
      >
        {playing ? (
          <VolumeX className="text-pink-500" />
        ) : (
          <Volume2 className="text-pink-500" />
        )}
      </button>

      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) scale(1);
          }
          100% {
            transform: translateY(-100px) scale(0.5);
          }
        }
        .animate-float {
          animation: float linear forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
