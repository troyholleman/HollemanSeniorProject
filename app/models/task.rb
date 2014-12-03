class Task < ActiveRecord::Base
  
  belongs_to :category
  
  validates :name, :category_id, :priority, presence: true
  validates :name, length: { maximum: 40 }
  validates :comment, length: { maximum: 20 }
  
end
