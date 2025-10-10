import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import { createCabin } from "../../services/apiCabins";
import FormRow from "../../ui/FormRow";

type FormValues = {
    name: string;
    maxCapacity: number;
    regularPrice: number;
    discount: number;
    description: string;
    image: FileList;
};

function CreateCabinForm() {
    const { register, handleSubmit, reset, getValues, formState } =
        useForm<FormValues>();

    const { errors } = formState;

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: createCabin,
        onSuccess: () => {
            toast.success("New cabin successfully created");

            queryClient.invalidateQueries({
                queryKey: ["cabin"],
            });
            reset();
        },

        onError: (err) => toast.error(err.message),
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        mutate({ ...data, image: data.image[0] });
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <FormRow label="Cabin name" error={errors.name?.message}>
                <Input
                    type="text"
                    id="name"
                    disabled={isPending}
                    {...register("name", {
                        required: "This field is required",
                    })}
                />
            </FormRow>

            <FormRow
                label="Maximum capacity"
                error={errors.maxCapacity?.message}
            >
                <Input
                    type="number"
                    id="maxCapacity"
                    disabled={isPending}
                    {...register("maxCapacity", {
                        valueAsNumber: true,
                        required: "This field is required",
                        min: {
                            value: 1,
                            message: "Capacity should be at least 1",
                        },
                    })}
                />
            </FormRow>

            <FormRow label="Regular price" error={errors.regularPrice?.message}>
                <Input
                    type="number"
                    id="regularPrice"
                    disabled={isPending}
                    {...register("regularPrice", {
                        valueAsNumber: true,
                        required: "This field is required",
                        min: {
                            value: 1,
                            message: "Price should be at least 1",
                        },
                    })}
                />
            </FormRow>

            <FormRow label="Discount" error={errors.discount?.message}>
                <Input
                    type="number"
                    id="discount"
                    disabled={isPending}
                    defaultValue={0}
                    {...register("discount", {
                        valueAsNumber: true,
                        required: "This field is required",
                        validate: (value) =>
                            value <= getValues().regularPrice ||
                            "Discount should be less than the regular price",
                    })}
                />
            </FormRow>

            <FormRow
                label="Description for website"
                error={errors.description?.message}
            >
                <Textarea
                    id="description"
                    defaultValue=""
                    disabled={isPending}
                    {...register("description", {
                        required: "This field is required",
                    })}
                />
            </FormRow>

            <FormRow label="Cabin photo">
                <FileInput
                    id="image"
                    accept="image/*"
                    disabled={isPending}
                    {...register("image", {
                        required: "This field is required",
                    })}
                />
            </FormRow>

            <FormRow>
                {/* type is an HTML attribute! */}
                <Button $variation="secondary" type="reset">
                    Cancel
                </Button>
                <Button disabled={isPending}>Add cabin</Button>
            </FormRow>
        </Form>
    );
}

export default CreateCabinForm;
