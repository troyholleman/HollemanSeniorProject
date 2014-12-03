class CategoriesController < ApplicationController
  
  before_action :set_cat, only: [:show, :edit, :update, :destroy]
  
  def index
    @categories = Category.all
  end

  def create
    @category = current_user.categories.new(category_params)
    
    if @category.valid?
      @category.save
    else
      flash[:alert] = @category.errors.full_messages
    end
    
    redirect_to root_path
  end
  
  def destroy
    @category.delete
    redirect_to root_path
  end
  
  def update
    if @category.update(category_params)
      redirect_to root_path
    else
      flash[:alert] = @category.errors.full_messages
      redirect_to root_path
    end
  end
  
  private
  
  def category_params
    params.require(:category).permit(:name, :color)
  end
  
  def set_cat
    @category = Category.find params[:id]
  end
end
