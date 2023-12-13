/* eslint-disable @typescript-eslint/no-explicit-any */
import { equalBytes } from "./bytes.js";
import { CID_TYPES } from "./constants.js";

import {
  encodeBase32RFC,
  encodeBase64URL,
  decodeBase64URL,
} from "./basetools.js";

/**
 * Represents a Multihash.
 */
export class Multihash {
  fullBytes: Uint8Array;

  /**
   * Creates a new instance of Multihash.
   * @param fullBytes - The full bytes of the Multihash.
   */
  constructor(fullBytes: Uint8Array) {
    this.fullBytes = fullBytes;
  }

  /**
   * Gets the function type of the Multihash.
   * @returns {number} The function type.
   */
  get functionType(): number {
    return this.fullBytes[0];
  }

  /**
   * Gets the hash bytes of the Multihash.
   * @returns {Uint8Array} The hash bytes.
   */
  get hashBytes(): Uint8Array {
    return this.fullBytes.subarray(1);
  }

  /**
   * Creates a Multihash from a base64 URL-encoded string.
   * @param hash - The base64 URL-encoded hash string.
   * @returns A Multihash instance.
   */
  static fromBase64Url(hash: string): Multihash {
    while (hash.length % 4 !== 0) {
      hash += "=";
    }
    const bytes = decodeBase64URL(hash);
    return new Multihash(new Uint8Array(bytes));
  }

  /**
   * Converts the Multihash to a base64 URL-encoded string.
   * @returns The base64 URL-encoded hash string.
   */
  toBase64Url(): string {
    return encodeBase64URL(this.fullBytes);
  }

  /**
   * Converts the Multihash to a base32-encoded string.
   * @returns The base32-encoded hash string.
   */
  toBase32(): string {
    return encodeBase32RFC(this.fullBytes).replace(/=/g, "").toLowerCase();
  }

  /**
   * Converts the Multihash to a string representation.
   * @returns The string representation of the Multihash.
   */
  toString(): string {
    return this.functionType === CID_TYPES.BRIDGE
      ? new TextDecoder().decode(this.fullBytes)
      : this.toBase64Url();
  }

  /**
   * Checks if the Multihash is equal to another object.
   * @param other - The other object to compare.
   * @returns True if the Multihash is equal to the other object, false otherwise.
   */
  equals(other: any): boolean {
    if (!(other instanceof Multihash)) {
      return false;
    }
    return equalBytes(this.fullBytes, other.fullBytes);
  }

  /**
   * Gets the hash code of the Multihash.
   * @returns {number} The hash code.
   */
  get hashCode(): number {
    return (
      this.fullBytes[0] +
      this.fullBytes[1] * 256 +
      this.fullBytes[2] * 256 * 256 +
      this.fullBytes[3] * 256 * 256 * 256
    );
  }
}
