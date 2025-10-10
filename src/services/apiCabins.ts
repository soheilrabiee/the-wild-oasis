import type { Database } from "../types/supabase";
import supabase, { supabaseUrl } from "./supabase";

type Cabin = Database["public"]["Tables"]["cabins"];
type CabinInsertDb = Cabin["Insert"];
type CabinUpdateDb = Cabin["Update"];
type CabinInsert = Omit<Cabin["Insert"], "image"> & { image: string | File };

export async function getCabins() {
    const { data, error } = await supabase.from("cabins").select("*");

    if (error) {
        console.error(error);
        throw new Error("Cabins could not be loaded");
    }

    return data;
}

export async function createEditCabin(newCabin: CabinInsert, id?: number) {
    const hasImagePath = typeof newCabin.image === "string";

    let imageName: string;
    if (typeof newCabin.image === "string") {
        imageName = newCabin.image;
    } else {
        imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
            "/",
            ""
        );
    }

    const imagePath = hasImagePath
        ? newCabin.image
        : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

    const { data, error } = await (!id
        ? // Create
          supabase
              .from("cabins")
              .insert([{ ...newCabin, image: imagePath } as CabinInsertDb])
              .select()
              .single()
        : // Update
          supabase
              .from("cabins")
              .update({ ...newCabin, image: imagePath } as CabinUpdateDb)
              .eq("id", id)
              .select()
              .single());

    if (error) {
        console.error(error);
        throw new Error("Cabins could not be created");
    }

    if (hasImagePath) return data;

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
