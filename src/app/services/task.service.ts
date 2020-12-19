import { Task } from './../model/task';
import { WebRequestService } from './web-request.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {



  constructor(private wrs:WebRequestService) { }

  createList(title:string){
    return this.wrs.post('lists',{title});
  }
  updateList(id:string,title:string){
    return this.wrs.patch(`lists/${id}`,{title});
  }

  updateTask(taskId: string, listId, title: string) {
    return this.wrs.patch(`list/${listId}/tasks/${taskId}`,{title});
  }

  getLists(){
    return this.wrs.get('lists');
  }

  getTasks(id:string){
    return this.wrs.get(`list/${id}/tasks`);
  }

  createTask(title:string,listid:string){
    return this.wrs.post(`list/${listid}/tasks`,{title});
  }
  completeTask(task:Task){
    return this.wrs.patch(`list/${task._listId}/tasks/${task._id}`,{
      completed:!task.completed
    });
  }

  deleteList(id:string){
    return this.wrs.delete(`lists/${id}`);
  }
  deleteTask(listid:string,taskId:string) {
    return this.wrs.delete(`list/${listid}/tasks/${taskId}`);
  }
}
