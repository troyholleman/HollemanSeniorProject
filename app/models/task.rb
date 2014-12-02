class Task < ActiveRecord::Base
  
  belongs_to :category
  
  validates :name, presence: true, uniqueness: true
  
end
