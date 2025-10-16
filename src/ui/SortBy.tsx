import Select from "./Select";

type SortByProps = {
    options: { value: string; label: string }[];
};

function SortBy({ options }: SortByProps) {
    return <Select options={options} type="white" />;
}

export default SortBy;
