class Category < ActiveRecord::Base
  
  belongs_to :user #, counter_cache: true
  has_many :tasks, :dependent => :destroy
  
  validates :name, presence: true, uniqueness: true
  validates :name, format: { without: /\s/ }
  validates :name, length: { maximum: 10 }
  
  validates :color, presence: true
  
end