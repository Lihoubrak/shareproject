"use client";

import React, { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeSwitcher = () => {
  // Initialize state with a default value
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply the theme on initial load (client-side only)
  useEffect(() => {
    // Check if localStorage is available (client-side)
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Set the initial theme based on localStorage or system preference
    setIsDarkMode(storedTheme === "dark" || (!storedTheme && prefersDark));
  }, []);

  // Update the theme in localStorage and apply the class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <button
      onClick={() => setIsDarkMode((prev) => !prev)}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="p-2 rounded focus:outline-none focus:ring"
    >
      {isDarkMode ? (
        <FaSun size={20} className="text-yellow-400" />
      ) : (
        <FaMoon size={22} className="text-blue-500" />
      )}
    </button>
  );
};

export default ThemeSwitcher;