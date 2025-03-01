"use client";

import React, { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import useToc from "@/hooks/useToc";

const PostToc = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { items, activeId } = useToc({
    containerSelector: ".article-content",
    headingSelector: "h2, h3",
    observerOptions: { rootMargin: "0px 0px -75% 0px", threshold: 1 },
  });

  const scrollToHeading = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    router.push(`${pathname}#${id}`, { scroll: false });
  };

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  if (!items.length) return <div>មិនមាននៅលើទំព័រនេះ</div>; // Return blank if no menu

  return (
    <div className="w-64 flex justify-center lg:justify-start order-3 lg:order-1">
      <div className="lg:sticky lg:h-[calc(100vh-120px)] lg:top-24 lg:overflow-auto">
        <h2 className="text-sm font-bold uppercase text-gray-700 dark:text-gray-300">
          នៅលើទំព័រនេះ
        </h2>
        <ul className="mt-4 space-y-2 text-sm">
          {items.map((item) => (
            <li
              key={`${item.id}-${item.text}`}
              style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
              className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Link
                href={`#${item.id}`}
                onClick={scrollToHeading(item.id)}
                className={`block py-1 ${
                  activeId === item.id
                    ? "text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostToc;
