export const isValidCoordinate = (
  latStr: string,
  lngStr: string,
): { isValid: boolean; error?: string } => {
  // If both are empty, it's fine since they are optional in your form
  if (!latStr && !lngStr) return { isValid: true };

  // If one is filled, both must be filled
  if ((latStr && !lngStr) || (!latStr && lngStr)) {
    return {
      isValid: false,
      error: "Both Latitude and Longitude must be provided together.",
    };
  }

  const lat = Number(latStr);
  const lng = Number(lngStr);

  // Check if they are valid numbers
  if (isNaN(lat) || isNaN(lng)) {
    return { isValid: false, error: "Coordinates must be valid numbers." };
  }

  // Validate Latitude range (-90 to 90)
  if (lat < -90 || lat > 90) {
    return {
      isValid: false,
      error: "Latitude must be a number between -90 and 90.",
    };
  }

  // Validate Longitude range (-180 to 180)
  if (lng < -180 || lng > 180) {
    return {
      isValid: false,
      error: "Longitude must be a number between -180 and 180.",
    };
  }

  return { isValid: true };
};
