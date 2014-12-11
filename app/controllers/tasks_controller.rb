class TasksController < ApplicationController
  
  before_action :set_task, only: [:show, :edit, :update, :destroy, :complete]
  
  def index
    @tasks = Task.all
  end
  
  def show
  end
  
  def create
    @task = current_user.tasks.new(task_params)
    @task.user_id = current_user.id
    @task.complete = false;
    
    if @task.valid?
      @task.save
      redirect_to root_path
    else
      flash[:alert] = @task.errors.full_messages
      redirect_to root_path
    end
  end
  
  def edit
  end
  
  def update
    if @task.update(task_params)
      redirect_to root_path
    else
      flash[:alert] = @task.errors.full_messages
      redirect_to root_path
    end
  end
  
  def destroy
    @task.destroy
    redirect_to root_path
  end
  
  def complete
    if @task.complete
      @task.complete = false
    else
      @task.complete = true
    end
    
    if @task.save
      flash[:success] = "Task Complete"
      redirect_to root_path
    else
      flash[:alert] = @task.errors.full_messages
      redirect_to root_path
    end
  end
  
  private
  
  def task_params
    params.require(:task).permit(:name, :priority, :deadline, :comment, :category_id)
  end
  
  def set_task
    @task = Task.find params[:id]
  end
  
end
