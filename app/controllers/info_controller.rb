class InfoController < ApplicationController
  def find_tasks
    @taskhash = {}
    
    categories = Category.all
    categories.each do |category|
      @taskhash[category.id] = category.tasks
    end
  end
end
