import { useEffect, useState } from "react";
import { Trophy, Sparkles, Heart } from "lucide-react";

interface CongratulationsAnimationProps {
  show: boolean;
  onClose: () => void;
}

export default function CongratulationsAnimation({ show, onClose }: CongratulationsAnimationProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (show) {
      setShowContent(true);
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-in fade-in duration-300">
      <div 
        className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center relative overflow-hidden animate-in zoom-in duration-500"
        onClick={onClose}
      >
        {/* Background sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" />
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10">
          <div className="mb-4 animate-bounce">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2 animate-in slide-in-from-bottom duration-500">
            Perfect Score!
          </h2>

          <p className="text-gray-600 mb-4 animate-in slide-in-from-bottom duration-700">
            Congratulations! You achieved a perfect 100 health score today!
          </p>

          <div className="flex items-center justify-center space-x-2 text-red-500 animate-in slide-in-from-bottom duration-1000">
            <Heart className="w-5 h-5 fill-current animate-pulse" />
            <span className="text-sm font-medium">Perfect Health Day</span>
            <Heart className="w-5 h-5 fill-current animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}