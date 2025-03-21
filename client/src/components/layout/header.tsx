import { useState } from "react";
import { Link, useLocation } from "wouter";
import { MenuIcon, User, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Workouts", path: "/workouts" },
    { name: "Nutrition", path: "/nutrition" },
    { name: "Progress", path: "/progress" },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M16 8L8 16M8 8L16 16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
          <Link href="/">
            <a className="ml-2 text-2xl font-bold text-text font-inter">FitAI</a>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a className={`text-text font-medium hover:text-primary transition-colors ${location === item.path ? 'text-primary' : ''}`}>
                {item.name}
              </a>
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <ThemeSwitcher />
          </div>
          
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center text-sm font-medium text-text hover:text-primary transition-colors">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span>John Doe</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/profile">
                    <a className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MenuIcon className="h-6 w-6 text-text" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10 mr-2">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">John Doe</div>
                      <div className="text-sm text-muted-foreground">john.doe@example.com</div>
                    </div>
                  </div>
                  {navItems.map((item) => (
                    <Link key={item.path} href={item.path}>
                      <a 
                        className={`text-text font-medium py-2 hover:text-primary transition-colors ${location === item.path ? 'text-primary' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    </Link>
                  ))}
                  <Link href="/profile">
                    <a 
                      className={`text-text font-medium py-2 hover:text-primary transition-colors ${location === '/profile' ? 'text-primary' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </a>
                  </Link>
                  <a className="text-text font-medium py-2 hover:text-primary transition-colors">
                    Logout
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
