import { useSearchParams } from "react-router";
import Select from "./Select";

type SortByProps = {
    options: { value: string; label: string }[];
};

function SortBy({ options }: SortByProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const sortBy = searchParams.get("sortBy") || "";

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        searchParams.set("sortBy", e.target.value);
        setSearchParams(searchParams);
    }

    return (
        <Select
            options={options}
            type="white"
            onChange={handleChange}
            value={sortBy}
        />
    );
}

export default SortBy;
