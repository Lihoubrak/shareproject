import { useEffect, useState, useCallback } from "react";

export default function useModal() {
  const [open, setOpen] = useState(false);

  const getScrollbarWidth = () => {
    // Tạo một phần tử tạm thời để đo độ rộng của thanh cuộn
    const scrollDiv = document.createElement("div");
    scrollDiv.style.width = "100px";
    scrollDiv.style.height = "100px";
    scrollDiv.style.overflow = "scroll";
    scrollDiv.style.position = "absolute";
    scrollDiv.style.top = "-9999px";
    document.body.appendChild(scrollDiv);

    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);

    return scrollbarWidth;
  };

  const handleOpen = useCallback(() => {
    if (open) return; // Tránh mở lại nếu đã mở

    setOpen(true);
    const scrollbarWidth = getScrollbarWidth();

    // Ẩn thanh cuộn và bù đắp khoảng trống
    document.documentElement.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }, [open]);

  const handleClose = useCallback(() => {
    if (!open) return; // Tránh đóng lại nếu đã đóng

    setOpen(false);

    // Khôi phục lại style ban đầu
    document.documentElement.style.overflow = "";
    document.body.style.paddingRight = "";
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown,{ passive: true });
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleClose]);

  return { open, handleOpen, handleClose };
}