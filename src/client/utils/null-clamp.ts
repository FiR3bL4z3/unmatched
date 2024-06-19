import { clamp } from "./clamp";

/**
 * Clamps a value between a minimum and maximum value
 *
 * @param value The value to clamp
 * @param min The minimum value
 * @param max The maximum value
 * @returns The clamped value or null if the value is NaN
 */
export const nullClamp = (value: number, min: number, max: number) =>
    isNaN(value) ? null : clamp(value, min, max);
