"use client";

import React, { useEffect, useState } from "react";

import { FaSun, FaMoon } from "react-icons/fa";

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

  if (!mounted) return;

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? <FaSun width={20} /> : <FaMoon width={22} />}
    </button>
  );
};

export default ThemeSwitcher;
