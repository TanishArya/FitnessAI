import { Link } from "wouter";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white mt-12 border-t border-gray-200">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M16 8L8 16M8 8L16 16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
              </svg>
              <h2 className="ml-2 text-xl font-bold text-text font-inter">FitAI</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">Personalized fitness and nutrition with AI</p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
          </div>
        </div>
        
        <div className="mt-6 border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between">
          <div className="flex flex-wrap space-x-6 mb-4 md:mb-0">
            <Link href="/about">
              <a className="text-sm text-gray-500 hover:text-text transition-colors">About</a>
            </Link>
            <Link href="/privacy">
              <a className="text-sm text-gray-500 hover:text-text transition-colors">Privacy</a>
            </Link>
            <Link href="/terms">
              <a className="text-sm text-gray-500 hover:text-text transition-colors">Terms</a>
            </Link>
            <Link href="/contact">
              <a className="text-sm text-gray-500 hover:text-text transition-colors">Contact</a>
            </Link>
          </div>
          
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} FitAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
