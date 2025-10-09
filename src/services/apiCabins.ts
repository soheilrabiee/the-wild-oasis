import type { Database } from "../types/supabase";
import supabase, { supabaseUrl } from "./supabase";

type Cabin = Database["public"]["Tables"]["cabins"];
type CabinInsert = Omit<Cabin["Insert"], "image"> & { image: File };

export async function getCabins() {
    const { data, error } = await supabase.from("cabins").select("*");

    if (error) {
        console.error(error);
        throw new Error("Cabins could not be loaded");
    }

    return data;
}

export async function createCabin(newCabin: CabinInsert) {
    const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
        "/",
        ""
    );
    const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

    // Create Cabin
    const { data, error } = await supabase
        .from("cabins")
        .insert([{ ...newCabin, image: imagePath }])
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error("Cabins could not be created");
    }

    // Upload image
    const { error: storageError } = await supabase.storage
        .from("cabin-images")
        .upload(imageName, newCabin.image);

    // Delete the cabin if there was an error uploading image
    if (storageError) {
        await supabase.from("cabins").delete().eq("id", data.id);
        console.error(storageError);
        throw new Error(
            "Cabins image could not be uploaded and the cabin was not created"
        );
    }

    return data;
}

export async function deleteCabin(id: Cabin["Row"]["id"]) {
    const { error, data } = await supabase.from("cabins").delete().eq("id", id);

    if (error) {
        console.error(error);
        throw new Error("Cabins could not be deleted");
    }

    return data;
}
