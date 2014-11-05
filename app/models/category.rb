class Category < ActiveRecord::Base
  
  belongs_to :user #, counter_cache: true
  has_many :tasks, :dependent => :destroy
  
end