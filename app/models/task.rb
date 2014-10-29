class Task < ActiveRecord::Base
  
  belongs_to :user
  belongs_to :category
  
  # =attr_accessible :name, :priority, :deadline, :comment
end
