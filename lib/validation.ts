// Validation utilities for user inputs

export function isValidEthereumAddress(address: string): boolean {
  // Ethereum address: 0x followed by 40 hexadecimal characters
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/
  return ethAddressRegex.test(address)
}

export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === "http:" || urlObj.protocol === "https:"
  } catch {
    return false
  }
}

export function isValidContractAddress(address: string): boolean {
  // Same as Ethereum address validation
  return isValidEthereumAddress(address)
}

export function validateWalletAddress(address: string): { valid: boolean; error?: string } {
  if (!address || address.trim() === "") {
    return { valid: false, error: "Wallet address is required" }
  }

  if (!isValidEthereumAddress(address)) {
    return {
      valid: false,
      error: "Invalid wallet address format. Must be 0x followed by 40 hexadecimal characters",
    }
  }

  return { valid: true }
}

export function validateContractAddress(address: string): { valid: boolean; error?: string } {
  if (!address || address.trim() === "") {
    return { valid: false, error: "Contract address is required" }
  }

  if (!isValidContractAddress(address)) {
    return {
      valid: false,
      error: "Invalid contract address format. Must be 0x followed by 40 hexadecimal characters",
    }
  }

  return { valid: true }
}

export function validateUrl(url: string): { valid: boolean; error?: string } {
  if (!url || url.trim() === "") {
    return { valid: false, error: "URL is required" }
  }

  if (!isValidUrl(url)) {
    return {
      valid: false,
      error: "Invalid URL format. Must start with http:// or https://",
    }
  }

  return { valid: true }
}
