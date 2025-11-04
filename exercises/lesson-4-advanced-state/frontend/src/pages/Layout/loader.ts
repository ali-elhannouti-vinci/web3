import ApiClient from "@/lib/api";
import type { User } from "@/types/User";

export interface LoaderData {
    users: User[];
}

export async function loader() {
    const users = await ApiClient.getUsers();
    console.log("Fetched users from loader (Layout): ",users);
    return { users };
}