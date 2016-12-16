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
      @o = params[:omessage]
      @wit = WitHelper::WitExtension.new
      @client = @wit.client
      @responses = []

    # Takes the following parameters:
    # session_id - a unique identifier describing the user session
    # message - the text received from the user
    # context - the Hash representing the session state
    # max_steps - (optional) the maximum number of actions to execute (defaults to 5)
    ## looking for the context that includes jibberjabber = true
    @context = {}
    @context["omessage"] = params[:omessage]

    @client.run_actions(@session_id, @q, @context)
      
      
      @responses = @wit.responses
      ## i need to bypass using the responses into using cleverbot
      # @responses = @wit.responses.take(1) if @wit.responses[0]["cleverbot"]
        
      # @responses.each{|response| response["last"] = false }
      # @responses.last["last"] = "last-messag"
      

      respond_to do |format|
        format.html  { render :json => @responses }
      end    
      
  end
  
end
