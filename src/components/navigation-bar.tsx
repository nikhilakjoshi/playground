"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Menu as MenuIcon, User, Grid3X3 } from "lucide-react";
import Image from "next/image";

export interface NavigationBarProps {
  onMenuClick?: () => void;
  userName?: string;
  userAvatar?: string;
}

// Logo component
function Logo() {
  return (
    <div className="flex items-center">
      <Image
        src="/citi_logo.svg"
        alt="Citi Logo"
        width={80}
        height={24}
        className="h-6 w-auto"
      />
    </div>
  );
}

// Animated Navigation Link Component
function AnimatedNavLink({
  href,
  children,
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <NavigationMenuItem className="relative">
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="group inline-flex h-10 w-max items-center justify-center px-6 py-2 text-sm font-medium text-white transition-colors hover:text-gray-200 hover:bg-transparent focus:text-white focus:bg-transparent focus-visible:bg-transparent focus:outline-none disabled:pointer-events-none disabled:opacity-50 relative z-10"
        >
          {children}
        </Link>
      </NavigationMenuLink>
      {isActive && (
        <motion.div
          className="absolute -bottom-[calc(0.5rem-1px)] left-0 right-0 h-1 bg-white rounded-full"
          layoutId="navigationUnderline"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 0.8,
          }}
        />
      )}
    </NavigationMenuItem>
  );
}

// User menu component
function UserMenu({
  userName = "User",
  userAvatar,
}: {
  userName?: string;
  userAvatar?: string;
}) {
  return (
    <div className="flex items-center space-x-3">
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:bg-gray-800 p-2 h-8 w-8"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>

      <Avatar className="h-7 w-7">
        <AvatarImage src={userAvatar} alt={userName} />
        <AvatarFallback className="bg-gray-600 text-white text-xs">
          <User className="h-3 w-3" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

// Navigation menu items
const navigationItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Calls",
    href: "/call-list",
  },
  {
    title: "Voice Analysis",
    href: "/voice-analysis-demo",
  },
  {
    title: "Wavesurfer Demo",
    href: "/wavesurfer-demo",
  },
];

// Main Navigation Bar Component
export function NavigationBar({
  onMenuClick,
  userName,
  userAvatar,
}: NavigationBarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Navigation Bar - Fixed to top */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black text-white">
        {/* First Row - Logo only */}
        <div className="px-6 py-3">
          <Logo />
        </div>

        {/* Second Row - Navigation Menu and User Controls */}
        <div className="px-6 py-2 relative">
          <div className="flex items-center justify-between">
            {/* Left side - Navigation Links */}
            <NavigationMenu>
              <NavigationMenuList className="flex space-x-2 relative">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <AnimatedNavLink
                      key={item.title}
                      href={item.href}
                      isActive={isActive}
                    >
                      {item.title}
                    </AnimatedNavLink>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Right side - Menu button and User Menu */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuClick}
                className="text-white hover:bg-gray-800 p-2 h-8 w-8"
              >
                <MenuIcon className="h-4 w-4" />
              </Button>
              <UserMenu userName={userName} userAvatar={userAvatar} />
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer div to push content below the fixed navigation */}
      <div className="h-[88px]" />
    </>
  );
}

// Sample usage component for demonstration
export function NavigationBarDemo() {
  const handleMenuClick = () => {
    console.log("Menu clicked");
  };

  return (
    <NavigationBar
      onMenuClick={handleMenuClick}
      userName="John Doe"
      userAvatar=""
    />
  );
}
