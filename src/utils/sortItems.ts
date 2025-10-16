export function sortItems<T>(
    data: T[],
    field: keyof T,
    direction: "asc" | "desc"
): T[] {
    const modifier = direction === "asc" ? 1 : -1;
    return [...data].sort((a, b) => {
        const aValue = a[field];
        const bValue = b[field];
        if (aValue == null || bValue == null) return 0;

        if (typeof aValue === "number" && typeof bValue === "number")
            return (aValue - bValue) * modifier;

        if (typeof aValue === "string" && typeof bValue === "string")
            return aValue.localeCompare(bValue) * modifier;

        return 0;
    });
}
