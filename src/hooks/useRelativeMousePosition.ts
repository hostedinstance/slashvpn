import { useEffect, RefObject, useCallback } from "react";
import { useMotionValue } from "framer-motion";

const useRelativeMousePosition = (to: RefObject<HTMLElement>) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const updateMousePosition = useCallback((event: MouseEvent) => {
    if (!to.current) {
      return;
    }
    const { top, left } = to.current.getBoundingClientRect();
    mouseX.set(event.x - left);
    mouseY.set(event.y - top);
  }, [mouseX, mouseY, to]);

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, [updateMousePosition]);

  return [mouseX, mouseY];
};

export default useRelativeMousePosition;