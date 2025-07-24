import BottomNavigation from "./bottom-navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen">
      {children}
      <BottomNavigation />
    </div>
  );
}