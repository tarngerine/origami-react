import { useEffect } from "react";
import { addFluidObserver, removeFluidObserver } from "@react-spring/shared";
import { SpringValue } from "@react-spring/web";

export function lerp(t: number, v0: number, v1: number) {
  return v0 * (1 - t) + v1 * t;
}

// temporary until we figure out onChange for SpringValue
export function useUpdate(value: SpringValue, callback: Function) {
  useEffect(() => {
    const check = () => {
      if (callback) callback();
      return true; // repeat
    };
    addFluidObserver(value, check);
    return () => removeFluidObserver(value, check);
  }, [value, callback]);
}
