export function convertVietnameseCurrency(amount) {
    if (isNaN(amount)) {
        throw new Error("Invalid amount. Please provide a valid number.");
    }

    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
}
