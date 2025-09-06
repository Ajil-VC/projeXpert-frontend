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

export interface ButtonType {

    triggeredFor?: string;
    label?: string;
    type: Button;
    action?: StatusAction | ViewModeAction | TimeFilter;
    icon?: string;
    color?: string;
    restriction?: boolean;
}