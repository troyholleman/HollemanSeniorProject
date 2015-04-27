class DashboardController < ApplicationController
  
  before_action :authenticate_user!
  
  def home
    
    @current_user = current_user
    @current_user_id = current_user.id
    
    @current_tasks = @current_user.tasks.where("complete = ? AND deadline >= ? OR deadline IS NULL", false, Date.today).order( 'deadline IS NULL, deadline DESC' )
    @completed_tasks = @current_user.tasks.where(complete: true)
    @overdue_tasks = @current_user.tasks.where("complete = ? AND deadline < ?", false, Date.today)
    
    @categories = @current_user.categories
    @category_options = @categories.map{ |u| [ u.name, u.id ] }
    
    # -- Javascript Variables -- #
    
    gon.clear
    updatePriorities
    
    gon.current_tasks = @current_tasks
    gon.completed_tasks = @completed_tasks
    gon.overdue_tasks = @overdue_tasks
    
    gon.category_options = @category_options
    gon.categories = @categories
    
  end
  
  def parseInput
    @categories = current_user.categories
    
    @name = ""
    @cat_name = ""
    @comment = ""
    @cat_id = nil
    @priority = nil
    @deadline = nil
    
    comment = false;
    deadline = false;
    temp = hash_params[:hash]
    temp = temp.split()
    
    temp.each do |string|
      if string.index('#') == 0
        @cat_name = string.split('#').last
        
      elsif string.index('$') == 0
        @priority = string.split('$').last
        
      elsif string.index(':') == 0
        @deadline = string.split(':').last << " "
        deadline = true
        comment = false
        
      elsif string.index('+') == 0
        @comment = string.split('+').last << " "
        comment = true
        deadline = false
        
      else
        if !comment && !deadline
          @name << string << " "
        elsif deadline
          @deadline << string << " "
        else
          @comment << string << " "
        end
      end
      
    end
    
    @categories.each do |cat|
      if cat.name.downcase == @cat_name.downcase
        @cat_id = cat.id
      end
    end
    
    begin
      Date.parse @deadline if !@deadline.nil?
    rescue
      flash[:alert] = "Invalid Date Format"
    end
    
    # flash[:alert] = @name.rstrip, @priority, @deadline, @comment, @cat_id, @cat_name
    
    @task = current_user.tasks.new(name: @name.rstrip, priority: @priority, deadline: @deadline, comment: @comment, category_id: @cat_id)
    @task.user_id = current_user.id
    @task.complete = false;
    
    if @task.valid?
      @task.save
      redirect_to root_path
    else
      flash[:alert] = @task.errors.full_messages
      redirect_to root_path
    end
  end
  
  private
  
  def updatePriorities
    @current_tasks = @current_user.tasks.where("complete = ? AND deadline >= ? OR deadline IS NULL", false, Date.today).order( 'deadline IS NULL, deadline ASC' )
    today = Date.parse Time.now.strftime('%d/%m/%Y')
    
    @current_tasks.each do |task|
      # task.created_at = Date.parse rand(1..7).to_s + "/" + 12.to_s + "/" + "2014"
      # task.save
      
      if !task.deadline.nil?
        created_at = Date.parse task.created_at.strftime('%d/%m/%Y')
        deadline = Date.parse task.deadline.strftime('%d/%m/%Y')
        
        timeline = (deadline.mjd - created_at.mjd).ceil
        timeline_checkpoint = (timeline.to_f / 3).ceil
        
        if timeline_checkpoint == 0 then timeline_checkpoint = 1 end
        daysUntil = deadline.mjd - today.mjd
        # daysUntil = deadline.mjd - Date.parse("25/12/2014").mjd
        
        # flash[:alert] = task.created_at, daysUntil, timeline, timeline_checkpoint
        
        if daysUntil <= timeline_checkpoint
          task.priority = 1;
        elsif daysUntil <= timeline_checkpoint * 2
          task.priority = 2;
        else
          task.priority = 3;
        end
        
        task.save
      end
      
    end
  end
  
  def hash_params
    params.require(:input).permit(:hash)
  end
  
end
