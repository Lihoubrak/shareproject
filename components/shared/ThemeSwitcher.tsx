"use client";

import React, { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from localStorage after mounting
  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    setIsDarkMode(storedTheme === "dark");
    setMounted(true);
  }, []);

  // Update localStorage and apply theme to the document
  useEffect(() => {
    if (!mounted) return;

    window.localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode, mounted]);

  // Prevent rendering until the component has mounted
  if (!mounted) {
    return null; // Return `null` instead of `undefined`
  }

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? <FaSun size={20} /> : <FaMoon size={22} />}
    </button>
  );
};

export default ThemeSwitcher;