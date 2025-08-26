import { ButtonType } from "./button.interface";

export interface HeaderConfig {
    title: string;
    icon?: string;
    subtitle: string;
    searchQuery: string;
    placeHolder: string;
    hideSearchBar?: boolean;

    buttons?: ButtonType[];
}