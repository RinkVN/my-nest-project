import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { FilterTodoDto } from './dto/filter-todo.dto';

@Injectable()
export class TodoService {
  private todos: Todo[] = []; // Mock database

  findAll(filter: FilterTodoDto): Todo[] {
    let result = [...this.todos];

    // Lọc theo completed
    if (filter.completed !== undefined) {
      result = result.filter(todo => todo.completed === filter.completed);
    }

    // Tìm kiếm theo title
    if (filter.title) {
      result = result.filter(todo =>
        todo.title.toLowerCase().includes((filter.title ?? '').toLowerCase()),
      );
    }

    return result;
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
      id: this.todos.length + 1, // Tạo ID tự động
      title: todo.title || 'Untitled',
      description: todo.description || '',
      completed: todo.completed || false,
      createdAt: new Date(),
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  update(id: number, updateData: Partial<Todo>): Todo {
    const todo = this.findOne(id); // Kiểm tra tồn tại
    Object.assign(todo, updateData);
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