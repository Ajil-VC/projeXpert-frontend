export interface Workspace {
    name: string;
    owner: string;
    isDefault: boolean;
    members: Array<string>;
}