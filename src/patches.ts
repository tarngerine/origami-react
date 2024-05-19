/* eslint-disable @typescript-eslint/no-use-before-define */

import { useSpring, SpringValue } from "@react-spring/web";
import { createStringInterpolator } from "@react-spring/shared";
import { useGesture } from "react-use-gesture";
import { convert } from "./convertPopAnimationConfig";
import { PopAnimationConfig } from "./types";
import { lerp, useUpdate } from "./utils";
import { raf } from "rafz";

function useSwitch(flip: SpringValue) {
  const { on } = useSpring({ on: 0 });

  useUpdate(flip, () => {
    const flipBool = flip.get() === 1;
    if (flipBool) on.set(on.get() === 1 ? 0 : 1);
  });

  return on;
}

function useInteraction() {
  const { down } = useSpring({ down: 0 });
  const { tap } = useSpring({ tap: 0 });

  const bind = useGesture({
    onPointerDown: (state) => {
      down.set(1);
    },
    onPointerUp: (state) => {
      down.set(0);
    },
    onDrag: ({ event, tap: tapped }) => {
      if (tapped) {
        tap.set(1); // pulse
        raf(() => {
          tap.set(0);
        });
      }
    }
  });

  return { bind, down, tap };
}

type PopAnimationInput = SpringValue;

function usePopAnimation(
  number: PopAnimationInput,
  config: PopAnimationConfig = {
    bounciness: 5,
    speed: 10
  }
) {
  const [{ value }, api] = useSpring(() => ({
    value: number.get(),
    config: convert(config)
  }));

  useUpdate(number, () => {
    api.start({ value: number.get() });
  });

  return value;
}

function useTransition(progress: SpringValue, range: number[] | string[]) {
  const [{ value }, api] = useSpring(() => ({
    value: transition(progress.get(), range)
  }));

  useUpdate(progress, () => {
    api.set({
      value: transition(progress.get(), range)
    });
  });

  return value;
}

function transition(value: number, range: number[] | string[]) {
  if (typeof range[0] === "number") {
    const numberRange = range as number[];
    return lerp(value, numberRange[0], numberRange[1]);
  } else if (typeof range[0] === "string") {
    const stringRange = range as string[];
    const interp = createStringInterpolator({ output: stringRange });
    return interp(value);
  }
}

export { useSwitch, useInteraction, usePopAnimation, useTransition };
