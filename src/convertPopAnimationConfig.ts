/* eslint-disable @typescript-eslint/no-use-before-define */

import { PopAnimationConfig } from "./types";
import { lerp } from "./utils";

// Converts Pop Animation bounciness and speed to friction and tension (and mass)
// for use with most spring calculations
// ported from https://github.com/facebookarchive/pop/blob/87d1f8b74cdaa4699d7a9f6be1ff5202014c581f/pop/POPAnimationExtras.mm#L53

const POPBouncy3NormalizationRange = 20.0;
const POPBouncy3NormalizationScale = 1.7;
const POPBouncy3BouncinessNormalizedMin = 0.0;
const POPBouncy3BouncinessNormalizedMax = 0.8;
const POPBouncy3SpeedNormalizedMin = 0.5;
const POPBouncy3SpeedNormalizedMax = 200;
const POPBouncy3FrictionInterpolationMax = 0.01;

export function convert({ bounciness, speed }: PopAnimationConfig) {
  let b = normalize(
    bounciness / POPBouncy3NormalizationScale,
    0,
    POPBouncy3NormalizationRange
  );
  b = projectNormal(
    b,
    POPBouncy3BouncinessNormalizedMin,
    POPBouncy3BouncinessNormalizedMax
  );

  let s = normalize(
    speed / POPBouncy3NormalizationScale,
    0,
    POPBouncy3NormalizationRange
  );

  let tension = projectNormal(
    s,
    POPBouncy3SpeedNormalizedMin,
    POPBouncy3SpeedNormalizedMax
  );
  let friction = interpolateQuadraticOut(
    b,
    noBounce(tension),
    POPBouncy3FrictionInterpolationMax
  );

  tension = POP_ANIMATION_TENSION_FOR_QC_TENSION(tension);
  friction = POP_ANIMATION_FRICTION_FOR_QC_FRICTION(friction);
  return {
    tension,
    friction,
    mass: 1
  };
}

function normalize(value: number, start: number, end: number) {
  return (value - start) / (end - start);
}

function projectNormal(value: number, start: number, end: number) {
  return start + value * (end - start);
}

function interpolateQuadraticOut(t: number, start: number, end: number) {
  return lerp(2 * t - t * t, start, end);
}

function noBounce(tension: number) {
  let friction = 0;
  if (tension <= 18) {
    friction = b3_friction1(tension);
  } else if (tension > 18 && tension <= 44) {
    friction = b3_friction2(tension);
  } else if (tension > 44) {
    friction = b3_friction3(tension);
  }
  return friction;
}

function b3_friction1(x: number) {
  return 0.0007 * Math.pow(x, 3) - 0.031 * Math.pow(x, 2) + 0.64 * x + 1.28;
}

function b3_friction2(x: number) {
  return 0.000044 * Math.pow(x, 3) - 0.006 * Math.pow(x, 2) + 0.36 * x + 2;
}

function b3_friction3(x: number) {
  return (
    0.00000045 * Math.pow(x, 3) - 0.000332 * Math.pow(x, 2) + 0.1078 * x + 5.84
  );
}

const POP_ANIMATION_FRICTION_FOR_QC_FRICTION = (qcFriction: number) =>
  25.0 + ((qcFriction - 8.0) / 2.0) * (25.0 - 19.0);
const POP_ANIMATION_TENSION_FOR_QC_TENSION = (qcTension: number) =>
  194.0 + ((qcTension - 30.0) / 50.0) * (375.0 - 194.0);
