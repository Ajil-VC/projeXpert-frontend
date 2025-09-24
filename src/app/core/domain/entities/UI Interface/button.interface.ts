import { Button, ReportFilter } from "./headerTypes";

interface StatusAction {
    statusFilters: {
        active: boolean,
        archived: boolean,
        completed: boolean
    }
}

interface ViewModeAction {
    viewMode?: 'grid' | 'list'
}

interface TimeFilter {
    filter: ReportFilter;
    startDate?: Date;
    endDate?: Date;
}

export interface DropDown {

    name: string;
    value: string;

}

export interface boardSwitcher {
    viewType?: 'board' | 'sprint_report';
}

export interface ButtonType {

    triggeredFor?: string;
    label?: string;
    type: Button;
    action?: StatusAction | ViewModeAction | TimeFilter | boardSwitcher;
    icon?: string;
    color?: string;
    dropDownData?: DropDown[];
    selectedOption?: string;
    restriction?: boolean;
}