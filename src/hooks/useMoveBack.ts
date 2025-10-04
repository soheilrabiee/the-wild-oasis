import { useNavigate } from "react-router";

export function useMoveBack() {
    const navigate = useNavigate();
    return () => navigate(-1);
}
