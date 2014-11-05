class Task < ActiveRecord::Base
  
  belongs_to :category
  # has_one :user, :through => :category
  
end
