import { Home, BookOpen, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function BottomNavigation() {
  const [location, navigate] = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: BookOpen, label: "Diary", path: "/trends" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-[9999] shadow-lg">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location === item.path;
          return (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => handleTabClick(item.path)}
              className={`flex flex-col items-center py-2 px-3 transition-colors ${
                isActive ? (item.path === "/trends" ? "text-purple-600" : "text-blue-600") : "text-gray-400"
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
