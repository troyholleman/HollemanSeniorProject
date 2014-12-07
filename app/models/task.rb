class Task < ActiveRecord::Base
  
  belongs_to :category
  
  validates :name, presence: true, length: { maximum: 40 }
  validates :category_id, presence: true
  # FIX THIS
  validates :priority, presence: true, inclusion: 1..10
  validates :comment, length: { maximum: 20 }
  
  
  validate :deadline_cannot_be_in_the_past
  
  def deadline_cannot_be_in_the_past
    errors.add(:deadline, "Can't be in the past") if
      !deadline.blank? and deadline < Date.today
  end
  
end
