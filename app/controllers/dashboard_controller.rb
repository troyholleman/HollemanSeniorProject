class DashboardController < ApplicationController
  
  before_action :authenticate_user!
  
  def home
    @current_user = current_user
    @current_user_id = current_user.id
    
    @categories = @current_user.categories
    
    # @current_tasks = @current_user.tasks
    @current_tasks = @current_user.tasks.where(complete: false).order(:priority, :deadline)
    @completed_tasks = @current_user.tasks.where(complete: true)
    
    @category_options = @categories.map{ |u| [ u.name, u.id ] }
    
    # -- Javascript Variables -- #
    
    gon.clear
    
    gon.current_user = @current_user
    gon.current_tasks = @current_tasks
    gon.completed_tasks = @completed_tasks
    gon.category_options = @category_options
    gon.categories = @categories
    # gon.cat_tasks = find_tasks_by_cat
  end
  
  # def find_tasks_by_cat
    # @hash = {}
    # categories = @categories
#     
    # categories.each do |c|
      # @hash[c.name] = c.tasks
    # end
#     
    # @hash
  # end
  
  def parseInput
    name = cat_id = priority = deadline = comment = nil
    temp = hash_params[:hash]
    temp = temp.split()
    
    temp.each do |string|
      if string.split(//).first === '-'
        name = string.split('-').last
      elsif string.split(//).first === '#'
        cat_id = string.split('#').last
      elsif string.split(//).first === '~'
        priority = string.split('~').last
      elsif string.split(//).first === ':'
        deadline = string.split(':').last
      elsif string.split(//).first === '+'
        comment = string.split('+').last
      end
    end
    
    # flash[:alert] = cat_id
    
    @task = current_user.tasks.new(name: name, category_id: cat_id, priority: priority, deadline: deadline, comment: comment)
    @task.user_id = current_user.id
    @task.complete = false;
    
    if @task.valid?
      @task.save
    else
      flash[:alert] = @task.errors.messages
    end
    
    redirect_to root_path
  end
  
  private
  
  def hash_params
    params.require(:input).permit(:hash)
  end
  
end
