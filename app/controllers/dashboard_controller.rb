class DashboardController < ApplicationController
  
  before_action :authenticate_user!
  
  def home
    
    @current_user = current_user
    @current_user_id = current_user.id
    
    @categories = @current_user.categories
    
    # -- Current Tasks -- #
    # @current_tasks = @current_user.tasks.where("complete = ? AND deadline >= ?", false, Date.today).order( :priority, :deadline)
    @current_tasks = @current_user.tasks.where(complete: false).order( :priority, :deadline)
    
    # -- Completed & Overdue Tasks -- #
    @completed_tasks = @current_user.tasks.where(complete: true)
    @overdue_tasks = @current_user.tasks.where("complete = ? AND deadline < ?", false, Date.today)
    
    @category_options = @categories.map{ |u| [ u.name, u.id ] }
    
    # -- Javascript Variables -- #
    gon.clear
    
    gon.current_tasks = @current_tasks
    gon.completed_tasks = @completed_tasks
    gon.overdue_tasks = @overdue_tasks
    
    gon.category_options = @category_options
    gon.categories = @categories
  end
  
  def parseInput
    @categories = current_user.categories
    
    @name = ""
    @cat_name = ""
    @comment = ""
    @cat_id = nil
    @priority = nil
    @deadline = nil
    
    temp = hash_params[:hash]
    temp = temp.split()
    
    temp.each do |string|
      if string.index('#') == 0
        @cat_name = string.split('#').last
        
      elsif string.index('$') == 0
        @priority = string.split('$').last
        
      elsif string.index(':') == 0
        @deadline = string.split(':').last
        
      elsif string.index('+') == 0
        @comment = string.split('+').last
        
      else
        @name << string << " "
      end
    end
    
    @categories.each do |cat|
      if cat.name == @cat_name
        @cat_id = cat.id
      end
    end
    
    # flash[:alert] = @name.rstrip, @priority, @deadline, @comment, @cat_id, @cat_name
    
    @task = current_user.tasks.new(name: @name.rstrip, priority: @priority, deadline: @deadline, comment: @comment, category_id: @cat_id)
    @task.user_id = current_user.id
    @task.complete = false;
    
    if @task.valid?
      # if @task.deadline === nil
        # @task.deadline = "none";
      # end
      
      @task.save
    else
      flash[:alert] = @task.errors.full_messages
    end
    
    redirect_to root_path
  end
  
  private
  
  def hash_params
    params.require(:input).permit(:hash)
  end
  
end
