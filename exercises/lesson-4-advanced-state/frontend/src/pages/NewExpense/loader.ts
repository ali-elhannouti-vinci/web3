import type { User } from "@/types/User"
import ApiClient from "@/lib/api";

export interface LoaderData {
    users:User[];
}

export async function loader() {
    const users = await ApiClient.getUsers();
    return {users};
}