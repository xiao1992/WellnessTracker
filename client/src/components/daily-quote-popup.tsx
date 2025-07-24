import { useEffect, useState } from "react";
import { X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DailyQuotePopupProps {
  show: boolean;
  onClose: () => void;
}

const bibleQuotes = [
  {
    quote: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    source: "Joshua 1:9"
  },
  {
    quote: "Trust in the Lord with all your heart and lean not on your own understanding.",
    source: "Proverbs 3:5"
  },
  {
    quote: "I can do all things through Christ who strengthens me.",
    source: "Philippians 4:13"
  },
  {
    quote: "Cast all your anxiety on him because he cares for you.",
    source: "1 Peter 5:7"
  },
  {
    quote: "The Lord is my strength and my shield; my heart trusts in him, and he helps me.",
    source: "Psalm 28:7"
  },
  {
    quote: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    source: "Philippians 4:6"
  },
  {
    quote: "The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.",
    source: "Zephaniah 3:17"
  }
];

export default function DailyQuotePopup({ show, onClose }: DailyQuotePopupProps) {
  const [currentQuote, setCurrentQuote] = useState(bibleQuotes[0]);

  useEffect(() => {
    if (show) {
      // Get quote based on current date for consistency
      const today = new Date();
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      const quoteIndex = dayOfYear % bibleQuotes.length;
      setCurrentQuote(bibleQuotes[quoteIndex]);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl p-6 max-w-md mx-auto relative shadow-2xl animate-in zoom-in-95 duration-500">
        {/* Quote */}
        <div className="text-center">
          <blockquote className="text-lg text-gray-700 italic leading-relaxed mb-6">
            "{currentQuote.quote}"
          </blockquote>
          <cite className="text-sm font-medium text-gray-600 mb-6 block">
            — {currentQuote.source}
          </cite>
          
          {/* Continue button */}
          <Button onClick={onClose} className="px-8">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}