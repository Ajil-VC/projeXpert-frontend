
export const PERMISSIONS = [

    "create_task",
    "view_task",
    "view_all_task",
    "edit_task",
    "delete_task",
    "assign_task",
    "comment_task",

    "create_epic",
    "edit_epic",

    "create_project",
    "view_project",
    "edit_project",
    "delete_project",

    "create_sprint",
    "start_sprint",
    "close_sprint",
    "view_sprint",

    "create_workspace",

    "create_room",
    "remove_room",

    "invite_user",
    "remove_user",
    "assign_role",
    "set_storyPoint",

    "manage_billing"
] as const;
export type Permissions = typeof PERMISSIONS[number];

export interface Roles {
    _id: string;
    companyId: string;
    name: string;
    description: string;
    permissions: Array<Permissions>;
    canMutate: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}