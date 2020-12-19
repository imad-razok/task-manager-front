import { Task } from './../../model/task';
import { List } from './../../model/list';
import { TaskService } from './../../services/task.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit {

  lists: List[];
  tasks: Task[];

  selectedList: string;

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params.listId) {
        this.selectedList = params.listId;
        this.taskService.getTasks(params.listId).subscribe((tasks: Task[]) => {
          this.tasks = tasks;
        });
      } else {
        this.tasks = undefined;
      }
    });

    this.taskService.getLists().subscribe((list: List[]) => {
      this.lists = list;
    });
  }

  onTaskComplite(task: Task) {
    this.taskService.completeTask(task).subscribe(() => {
      console.log('completed seccessully')
      task.completed = !task.completed;
    });
  }
  onDeleteListClick() {
    this.taskService.deleteList(this.selectedList).subscribe((res: any) => {
      this.router.navigate(['/lists']);
      console.log(res);
    });
  }

  onTaskDeleteClick(taskId: string) {
    this.taskService.deleteTask(this.selectedList, taskId).subscribe((res: any) => {
      this.tasks=this.tasks.filter(val=>val._id!==taskId);
      console.log(res);
    });
  }

}
