
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ActivitySquare, FileBarChart, Home, Lightbulb, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { title: "Home", href: "/", icon: <Home className="mr-2 h-4 w-4" /> },
    { title: "Assessment", href: "/assessment", icon: <ActivitySquare className="mr-2 h-4 w-4" /> },
    { title: "Results", href: "/results", icon: <FileBarChart className="mr-2 h-4 w-4" /> },
    { title: "Resources", href: "/resources", icon: <Lightbulb className="mr-2 h-4 w-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-parkinsons-600 text-white p-1 rounded-md">
              <ActivitySquare className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold hidden sm:block">Parkinson Insight</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Button key={item.href} variant="ghost" asChild>
              <Link to={item.href} className="flex items-center text-sm font-medium">
                {item.icon}
                {item.title}
              </Link>
            </Button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="parkinsons" asChild className="hidden md:flex">
            <Link to="/assessment">Start Assessment</Link>
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Button key={item.href} variant="ghost" asChild onClick={() => setIsOpen(false)}>
                    <Link to={item.href} className="flex items-center">
                      {item.icon}
                      {item.title}
                    </Link>
                  </Button>
                ))}
                <Button variant="parkinsons" asChild onClick={() => setIsOpen(false)}>
                  <Link to="/assessment">Start Assessment</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
