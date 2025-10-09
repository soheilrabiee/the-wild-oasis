import styled from "styled-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    useForm,
    type SubmitHandler,
    type SubmitErrorHandler,
} from "react-hook-form";
import toast from "react-hot-toast";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import { createCabin } from "../../services/apiCabins";

const FormRow = styled.div`
    display: grid;
    align-items: center;
    grid-template-columns: 24rem 1fr 1.2fr;
    gap: 2.4rem;

    padding: 1.2rem 0;

    &:first-child {
        padding-top: 0;
    }

    &:last-child {
        padding-bottom: 0;
    }

    &:not(:last-child) {
        border-bottom: 1px solid var(--color-grey-100);
    }

    &:has(button) {
        display: flex;
        justify-content: flex-end;
        gap: 1.2rem;
    }
`;

const Label = styled.label`
    font-weight: 500;
`;

const Error = styled.span`
    font-size: 1.4rem;
    color: var(--color-red-700);
`;

type FormValues = {
    name: string;
    maxCapacity: number;
    regularPrice: number;
    discount: number;
    description: string;
};

function CreateCabinForm() {
    const { register, handleSubmit, reset, getValues } = useForm<FormValues>();

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

    const onError: SubmitErrorHandler<FormValues> = (errors) =>
        console.log(errors);

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        mutate(data);
    };
    return (
        <Form onSubmit={handleSubmit(onSubmit, onError)}>
            <FormRow>
                <Label htmlFor="name">Cabin name</Label>
                <Input
                    type="text"
                    id="name"
                    {...register("name", {
                        required: "This field is required",
                    })}
                />
            </FormRow>

            <FormRow>
                <Label htmlFor="maxCapacity">Maximum capacity</Label>
                <Input
                    type="number"
                    id="maxCapacity"
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

            <FormRow>
                <Label htmlFor="regularPrice">Regular price</Label>
                <Input
                    type="number"
                    id="regularPrice"
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

            <FormRow>
                <Label htmlFor="discount">Discount</Label>
                <Input
                    type="number"
                    id="discount"
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

            <FormRow>
                <Label htmlFor="description">Description for website</Label>
                <Textarea
                    id="description"
                    defaultValue=""
                    {...register("description", {
                        required: "This field is required",
                    })}
                />
            </FormRow>

            <FormRow>
                <Label htmlFor="image">Cabin photo</Label>
                <FileInput id="image" accept="image/*" />
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
