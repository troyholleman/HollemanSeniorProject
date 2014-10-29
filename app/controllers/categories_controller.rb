class CategoriesController < ApplicationController
  
  def index
    @categories = Category.all
  end

  def create
    @category = Category.new(article_params)
 
    @category.save
    redirect_to '/categories'
  end
  
  private
  
  def article_params
    params.require(:category).permit(:name)
  end
end
