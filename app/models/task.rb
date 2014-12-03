class Task < ActiveRecord::Base
  
  belongs_to :category
  
  validates :name, :category_id, :priority, presence: true
  
end
