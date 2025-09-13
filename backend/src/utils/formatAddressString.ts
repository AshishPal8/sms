export function formatAddressString(
  addr?:
    | {
        houseNumber?: string | null;
        locality?: string | null;
        city?: string | null;
        state?: string | null;
        country?: string | null;
        postalCode?: string | null;
      }
    | string
    | undefined
) {
  if (!addr) return "";
  if (typeof addr === "string") return addr;
  return [
    addr.houseNumber,
    addr.locality,
    addr.city,
    addr.state,
    addr.country,
    addr.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
}
