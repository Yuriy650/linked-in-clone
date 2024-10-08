import {Role} from "./role.enum";
import {FeedPost} from "../../feed/models/post.interface";

export interface User {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: Role;
    posts?: FeedPost[]
}
