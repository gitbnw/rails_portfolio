class WitController < ApplicationController
    def converse
        
      @session_id = params[:session_id]
      @q = params[:q]
      @wit = WitHelper::WitExtension.new
      @client = @wit.client
      @responses = []
      @client.run_actions(@session_id, @q)
      @responses = @wit.responses
    
      respond_to do |format|
        format.html  # index.html.erb
        format.json  { render :json => @responses }
      end 
    
    end

end
