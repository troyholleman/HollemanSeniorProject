class DashboardController < ApplicationController
  
  before_action :authenticate_user!
  
  def home
    
    @current_user = current_user
    
    @categories = @current_user.categories
    @tasks = @current_user.tasks
    # @users = User.all
    
    @category_options = @categories.map{ |u| [ u.name, u.id ] }
    
    # -------- Javascript Variables ---------- #
    
    gon.clear
    
    gon.current_user = @current_user
    gon.tasks = @tasks
    gon.categories = @categories
    gon.cat_tasks = find_tasks_by_cat
    
    gon.users = @users
  end
  
  def find_tasks_by_cat
    @hash = {}
    categories = @categories
    categories.each do |c|
      @hash[c.name] = c.tasks
    end
    
    @hash
  end
  
end
