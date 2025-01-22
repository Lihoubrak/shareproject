import { useEffect, useState, useCallback } from "react";

export default function useProgress(containerSelector: string) {
  const [enable, setEnable] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);

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

  const calculateProgress = useCallback(() => {
    const container = document.querySelector(containerSelector);

    if (!enable || !container) return;

    const headerHeight = 64;
    const rect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const contentHeight = rect.height;

    const scrolled = headerHeight - rect.top;
    const scrollable = contentHeight - viewportHeight;

    const progress = (scrolled / scrollable) * 100;

    setProgress(Math.min(100, Math.max(0, progress)));
  }, [containerSelector, enable]);

  useEffect(() => {
    if (!enable) return;

    const handleScroll = () => {
      requestAnimationFrame(calculateProgress);
    };

    const handleResize = () => {
      requestAnimationFrame(calculateProgress);
    };

    window.addEventListener("scroll", handleScroll,{ passive: true });
    window.addEventListener("resize", handleResize,{ passive: true });

    // Tính toán tiến trình ban đầu
    calculateProgress();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [enable, calculateProgress]);

  return { enable, progress };
}