class DashboardController < ApplicationController
  
  def home
    @tasks = Task.all
    @categories = Category.all
  end
  
end
