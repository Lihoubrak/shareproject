"use client";

import React, { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeSwitcher = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Ensure that the theme is applied correctly on mount
  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(storedTheme === "dark" || (!storedTheme && prefersDark));
  }, []);

  // Update theme in localStorage and apply the class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    window.localStorage.setItem("theme", isDarkMode ? "dark" : "light");
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
