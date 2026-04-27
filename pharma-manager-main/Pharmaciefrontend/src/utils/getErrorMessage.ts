export const getErrorMessage = (error: unknown): string => {
  // Try to access backend response data (axios style)
  const data = (error as any)?.response?.data;

  // Case 1: API returns a simple string message
  if (typeof data === "string") {
    return data;
  }

  // Case 2: API returns { detail: "message" }
  if (data?.detail && typeof data.detail === "string") {
    return data.detail;
  }

  // Case 3: API returns { stock: "message" }
  if (data?.stock && typeof data.stock === "string") {
    return data.stock;
  }

  // Case 4: API returns an object with multiple fields
  if (data && typeof data === "object") {
    const values = Object.values(data);

    // Example: { field: ["error1", "error2"] }
    if (Array.isArray(values[0])) {
      return String(values[0][0]);
    }

    // Example: { field: "error message" }
    if (typeof values[0] === "string") {
      return values[0];
    }
  }

  // Default fallback message
  return "Une erreur est survenue. Veuillez réessayer.";
};