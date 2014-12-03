class TasksController < ApplicationController
  
  before_action :set_task, only: [:show, :edit, :update, :destroy]
  
  def index
    @tasks = Task.all
    @categories = Category.all
  end
  
  def show
  end
  
  def create
    @task = current_user.tasks.new(task_params)
    @task.user_id = current_user.id
    @task.complete = false;
    
    if @task.valid?
      @task.save
    else
      flash[:alert] = @task.errors.full_messages
    end
    
    redirect_to root_path
  end
  
  def edit
  end
  
  def update
    if @task.update(task_params)
      redirect_to root_path
    else
      redirect_to root_path
    end
  end
  
  def destroy
    @task.destroy
    
    redirect_to root_path
  end
  
  def complete
    task = set_task
    if !task.complete
      task.complete = true;
    else
      task.complete = false;
    end
    task.save
    
    redirect_to root_path
  end
  
  private
  
  def task_params
    params.require(:task).permit(:name, :priority, :deadline, :comment, :category_id)
  end
  
  def set_task
    @task = Task.find params[:id]
  end
  
end
