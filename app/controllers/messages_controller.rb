class MessagesController < ApplicationController

  def show
    respond_with Message.all
  end 
  
  def index
    respond_with Message.all
  end
  
  def converse
      
      @session_id = params[:session_id]
      @q = params[:q]
      @wit = WitHelper::WitExtension.new
      @client = @wit.client
      @responses = []
      @client.run_actions(@session_id, @q)
      @responses = @wit.responses
      # @responses.each{|response| response["last"] = false }
      # @responses.last["last"] = true
      

      respond_to do |format|
        format.html  { render :json => @responses }
      end    
      
  end
  
end
