import { Workspace } from "../../core/domain/entities/workspace.model";

export interface IConverter<TSource, TTarget> {
    convert(source: TSource): TTarget;
}


export class WorkspaceConverter implements IConverter<Workspace<true>, Workspace> {
    convert(source: Workspace<true>): Workspace<false> {
        return {
            _id: source._id,
            companyId: source.companyId,
            currentProject: source.currentProject,
            members: source.members,
            name: source.name,
            projects: source.projects.map(p => p._id)
        }

    }

}