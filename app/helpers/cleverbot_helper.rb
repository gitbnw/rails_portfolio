module CleverbotHelper
require 'cleverbot'

    class CleverbotExtension
        def initialize
            user_token = ENV["cleverbot_user_token"]
            api_key = ENV["cleverbot_api_key"]
            @cleverbot = Cleverbot.new(user_token, api_key)
        end
        
        def cleverbot
            return @cleverbot
        end
    
    end


end