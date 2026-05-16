import { DEFAULT_PROPERTY_CATEGORIES } from "./siteContent";

export function formatKenyanCurrency(amount) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "KSh 0";
  }

  const hasDecimals = Math.abs(numericAmount % 1) > 0;

  return `KSh ${numericAmount.toLocaleString("en-KE", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatKenyanDateTime(value) {
  if (!value) {
    return "N/A";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  }).format(parsedDate);
}

export function getCategoryOptions(categories = []) {
  if (Array.isArray(categories) && categories.length > 0) {
    return categories;
  }

  return DEFAULT_PROPERTY_CATEGORIES.map((category, index) => ({
    _id: `default-category-${index}`,
    category,
  }));
}
