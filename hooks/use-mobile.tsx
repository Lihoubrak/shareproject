import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Khởi tạo giá trị ban đầu dựa trên kích thước màn hình hiện tại
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  const handleChange = React.useCallback((event: MediaQueryListEvent) => {
    setIsMobile(event.matches);
  }, []);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Lắng nghe sự kiện thay đổi kích thước màn hình
    mql.addEventListener("change", handleChange);

    // Cập nhật giá trị ban đầu
    setIsMobile(mql.matches);

    // Cleanup event listener khi component unmount
    return () => {
      mql.removeEventListener("change", handleChange);
    };
  }, [handleChange]);

  return isMobile;
}