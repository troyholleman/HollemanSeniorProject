class DashboardController < ApplicationController
  
  before_action :authenticate_user!
  
  def home
    @tasks = Task.all
    @categories = Category.all
    @users = User.all
    
    @c_user = current_user
    @category_options = current_user.categories.map{|u| [ u.name, u.id ] }
    
    # -------- Javascript Variables ---------- #
    
    gon.tasks = @tasks
    gon.categories = @categories
    gon.users = @users
    
    # -------- Diagnostic Information ---------- #
    
    gon.user_cat = @c_user.categories
    gon.user_task = @c_user.tasks
    
    gon.category_options = @category_options
    
    # gon.c_user_cat = @categories.first.tasks
    # gon.c_user_task = @c_user.tasks
  end
  
end
