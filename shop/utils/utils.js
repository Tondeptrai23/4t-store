import path from "path";
import { fileURLToPath } from "url";

export function convertVietnameseCurrency(amount) {
    if (isNaN(amount)) {
        throw new Error("Invalid amount. Please provide a valid number.");
    }

    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(path.dirname(__filename), "..");

export { __dirname, __filename };
