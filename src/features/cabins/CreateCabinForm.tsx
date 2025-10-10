import { useForm, type SubmitHandler } from "react-hook-form";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import type { Database } from "../../types/supabase";

import { useCreateCabin } from "./useCreateCabin";
import { useUpdateCabin } from "./useUpdateCabin";

type Cabin = Database["public"]["Tables"]["cabins"]["Update"];

type FormValues = {
    name: string;
    maxCapacity: number;
    regularPrice: number;
    discount: number;
    description: string;
    image: FileList;
};

function CreateCabinForm({
    cabinToEdit = {} as Cabin,
}: {
    cabinToEdit?: Cabin;
}) {
    const { isCreating, createCabin } = useCreateCabin();
    const { isEditing, editCabin } = useUpdateCabin();
    const { id: editId, ...editValues } = cabinToEdit;
    const isEditSession = Boolean(editId);

    const formDefaultValues: Partial<FormValues> = isEditSession
        ? {
              name: editValues.name ?? "",
              maxCapacity: editValues.maxCapacity ?? 0,
              regularPrice: editValues.regularPrice ?? 0,
              discount: editValues.discount ?? 0,
              description: editValues.description ?? "",
              // File inputs cannot be pre-filled, so we just leave it empty
              image: undefined as unknown as FileList,
          }
        : {};

    const { register, handleSubmit, reset, getValues, formState } =
        useForm<FormValues>({
            defaultValues: formDefaultValues,
        });

    const { errors } = formState;

    const isWorking = isCreating || isEditing;

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        const image =
            data.image.length === 0 ? cabinToEdit.image : data.image[0];

        if (isEditSession && image)
            editCabin(
                { newCabinData: { ...data, image }, id: editId },
                {
                    onSuccess: (data) => reset(),
                }
            );
        else if (!isEditSession && image)
            createCabin(
                { ...data, image: image },
                {
                    // This callback function gets access to the data that is returned from the mutation function
                    onSuccess: (data) => reset(),
                }
            );
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <FormRow label="Cabin name" error={errors.name?.message}>
                <Input
                    type="text"
                    id="name"
                    disabled={isWorking}
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
                    disabled={isWorking}
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
                    disabled={isWorking}
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
                    disabled={isWorking}
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
                    disabled={isWorking}
                    {...register("description", {
                        required: "This field is required",
                    })}
                />
            </FormRow>

            <FormRow label="Cabin photo">
                <FileInput
                    id="image"
                    accept="image/*"
                    disabled={isWorking}
                    {...register("image", {
                        required: isEditSession
                            ? false
                            : "This field is required",
                    })}
                />
            </FormRow>

            <FormRow>
                {/* type is an HTML attribute! */}
                <Button $variation="secondary" type="reset">
                    Cancel
                </Button>
                <Button disabled={isWorking}>
                    {isEditSession ? "Edit Cabin" : "Create new cabin"}
                </Button>
            </FormRow>
        </Form>
    );
}

export default CreateCabinForm;
