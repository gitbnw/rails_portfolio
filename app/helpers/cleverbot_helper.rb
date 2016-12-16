module CleverbotHelper
require 'cleverbot'

    class CleverbotExtension
        def initialize
            user_token = "QTll0EuFwuHCDsjv"
            api_key = "wQMfGRsukd1aUY3NHiJvqXibflxhYkgU"
            @cleverbot = Cleverbot.new(user_token, api_key)
        end
        
        def cleverbot
            return @cleverbot
        end
    
    end


end