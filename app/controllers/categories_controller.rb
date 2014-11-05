class CategoriesController < ApplicationController
  
  def index
    @categories = Category.all
  end

  def create
    @category = current_user.categories.new(category_params)
    
    @category.save
    redirect_to root_path
  end
  
  private
  
  def category_params
    params.require(:category).permit(:name)
  end
end
