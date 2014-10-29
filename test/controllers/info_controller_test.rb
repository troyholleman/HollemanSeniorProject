require 'test_helper'

class InfoControllerTest < ActionController::TestCase
  test "should get find_tasks" do
    get :find_tasks
    assert_response :success
  end

end
