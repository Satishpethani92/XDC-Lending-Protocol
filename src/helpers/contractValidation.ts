/**
 * Contract address validation utilities
 * Used to prevent contract calls on networks where contracts aren't deployed
 */

// Zero address constant for validation
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/**
 * Checks if an address is valid (non-zero and properly formatted)
 * @param address - The address to validate
 * @returns true if the address is valid, false otherwise
 */
export function isValidContractAddress(address: string | undefined): boolean {
  if (!address) return false;
  if (address === ZERO_ADDRESS) return false;
  if (!address.startsWith("0x")) return false;
  if (address.length !== 42) return false;
  return true;
}
