import { Component, Input } from '@angular/core';
import { CommentService } from './comment.service';
import { Comment, Task } from '../../../../core/domain/entities/task.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../core/domain/entities/user.model';

@Component({
  selector: 'app-comment-section',
  imports: [CommonModule, FormsModule],
  templateUrl: './comment-section.component.html',
  styleUrl: './comment-section.component.css'
})
export class CommentSectionComponent {


  @Input() task!: Task;

  comments: Comment[] = [];
  newComment = '';

  constructor(private commentService: CommentService) { }

  ngOnInit() {

    const c = [{
      taskId: 'string',
      userId: 'string | User',
      content: 'asdfsadfasdfasdf',
      createdAt: new Date,
      updatedAt: new Date
    }]
    this.comments = c;
    this.commentService.getCommentsForTask(this.task._id).subscribe({
      next: (res: { status: boolean, result: Comment[] }) => {

        if (res.status) {
          this.comments = res.result;
        }
      },
      error: (err) => {

      }
    });
  }

  getEmail(user: any) {
    if (!user) return '';
    return user.email;
  }

  addComment() {

    if (!this.newComment.trim()) return;

    const comment: Comment = {
      taskId: this.task._id,
      content: this.newComment.trim()
    };

    this.commentService.addComment(comment).subscribe({
      next: (res: { status: boolean, result: Comment }) => {
        if (res.status)
          this.comments.unshift(res.result);
          console.log(res)
      },
      error: (err) => {

      }
    });
    this.newComment = '';
  }



}
