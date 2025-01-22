"use client";

import React, { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa"; // Import icons from react-icons

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    typeof window !== "undefined" ? window.localStorage.getItem("theme") === "dark" : false
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="p-2 rounded focus:outline-none focus:ring"
    >
      {isDarkMode ? (
        <FaSun size={20} className="text-yellow-400" /> // Sun icon with yellow color
      ) : (
        <FaMoon size={22} className="text-blue-500" /> // Moon icon with blue color
      )}
    </button>
  );
};

export default ThemeSwitcher;
