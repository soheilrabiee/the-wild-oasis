import { useMutation } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

type useLoginType = {
    email: string;
    password: string;
};

export function useLogin() {
    const navigate = useNavigate();

    const { mutate: login, isPending } = useMutation({
        mutationFn: ({ email, password }: useLoginType) =>
            loginApi({ email, password }),
        onSuccess: () => {
            navigate("/dashboard");
        },
        onError: (err) => {
            console.log("ERROR", err);
            toast.error(err.message);
        },
    });

    return { login, isPending };
}
