class TasksController < ApplicationController
  
  before_action :set_task, only: [:show, :edit, :update, :destroy]
  
  def index
    @tasks = Task.all
  end
  
  def show
  end
  
  def create
    @task = current_user.tasks.new(task_params)
    @task.user_id = current_user.id
    # @join = current_user.categories.joins(:tasks).where('tasks.category_id' => :category_id )
    # @task = current_user.categories.tasks.new(task_params)
 
    @task.save
    redirect_to root_path
  end
  
  def edit
  end
  
  def update
    if @task.update(task_params)
      redirect_to root_path
    else
      render :edit
      # IS THIS RIGHT??
    end
  end
  
  def destroy
    @task.destroy
    
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
