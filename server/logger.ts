import { gray } from "@colors/colors";

/**
 * Create a logging function for a module
 * @param moduleName Module name
 * @returns Logging function
 */
export function createLogger(moduleName: string) {
  return (str: string) =>
    console.log(`${gray(new Date().toISOString())} ${moduleName} ${str}`);
}
