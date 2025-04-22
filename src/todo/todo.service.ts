import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { FilterTodoDto } from './dto/filter-todo.dto';

@Injectable()
export class TodoService {
  private todos: Todo[] = [];

  findAll(filter: FilterTodoDto): Todo[] {
    let result = [...this.todos];
    if (filter.completed !== undefined) {
      result = result.filter(todo => todo.completed === filter.completed);
    }
    if (filter.title) {
      result = result.filter(todo =>
        todo.title && typeof todo.title === 'string' // Kiểm tra title tồn tại và là string
          ? todo.title.toLowerCase().includes((filter.title ?? '').toLowerCase())
          : false,
      );
    }
    return result;
  }

  findCompleted(): Todo[] {
    return this.todos.filter(todo => todo.completed === true);
  }

  findOne(id: number): Todo {
    const todo = this.todos.find(todo => todo.id === id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  create(todo: Partial<Todo>): Todo {
    const newTodo: Todo = {
      id: this.todos.length + 1,
      title: todo.title || '', // Đảm bảo title không bao giờ là undefined
      description: todo.description || '',
      completed: todo.completed || false,
      createdAt: new Date(),
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  update(id: number, updateData: Partial<Todo>): Todo {
    const todo = this.findOne(id);
    Object.assign(todo, {
      ...updateData,
      title: updateData.title !== undefined ? updateData.title : todo.title, // Đảm bảo title không bị undefined
      description: updateData.description !== undefined ? updateData.description : todo.description,
    });
    return todo;
  }

  delete(id: number): void {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    this.todos.splice(index, 1);
  }
}