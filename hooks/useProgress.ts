import { useEffect, useState, useCallback } from "react";

export default function useProgress(containerSelector: string) {
  const [enable, setEnable] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const calculateProgress = useCallback(() => {
    const container = document.querySelector(containerSelector);

    if (!enable || !container) return;

    const headerHeight = 64;
    const rect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const contentHeight = rect.height;

    // Handle edge case where content height is smaller than viewport height
    if (contentHeight <= viewportHeight) {
      setProgress(100);
      return;
    }

    const scrolled = headerHeight - rect.top;
    const scrollable = contentHeight - viewportHeight;

    const progress = (scrolled / scrollable) * 100;

    setProgress(Math.min(100, Math.max(0, progress)));
  }, [containerSelector, enable]);

  useEffect(() => {
    const container = document.querySelector(containerSelector);

    if (!container) {
      console.warn(`Container with selector "${containerSelector}" not found.`);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!enable && entry.isIntersecting) {
            setEnable(true);
          }
        });
      },
      { rootMargin: `0px 0px -${window.innerHeight - 64}px 0px`, threshold: 0 }
    );

    observer.observe(container);

    return () => {
      observer.unobserve(container);
    };
  }, [containerSelector, enable]);

  useEffect(() => {
    if (!enable) return;

    const handleScroll = () => {
      requestAnimationFrame(calculateProgress);
    };

    const handleResize = () => {
      requestAnimationFrame(calculateProgress);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Calculate initial progress after a short delay to ensure layout stability
    const timeoutId = setTimeout(() => {
      calculateProgress();
    }, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [enable, calculateProgress]);

  return { enable, progress };
}