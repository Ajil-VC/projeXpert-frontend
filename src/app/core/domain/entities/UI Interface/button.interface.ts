
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

export interface ButtonType {

    triggeredFor?: string;
    label?: string;
    type: 'main' | 'view' | 'filter';
    action?: StatusAction | ViewModeAction;
    icon?: string;
    color?: string;
}