import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../../../../../../core/domain/entities/task.model';

@Pipe({
  name: 'activeEpic'
})
export class ActiveEpicPipe implements PipeTransform {

  transform(epics: Task[], epicView: 'active' | 'compelted' = 'active'): Task[] {

    if (epicView === 'active') {
      return epics?.filter(issue => issue.status !== 'done') || [];
    } else {
      return epics?.filter(issue => issue.status === 'done') || [];
    }
  }

}
