

export interface Team {

    _id: string;
    name: string;
    email: string,

    profilePicUrl: string,
    role: "user" | "admin",

    createdAt?: Date,
    updatedAt?: Date,

}