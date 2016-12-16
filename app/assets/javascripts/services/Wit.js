// Converse with WitAI by post requests handled on server
(function() {
    function Wit($http) {

        return {
            converse: function(witData, context){
              return $http({
                 url: "converse",
                 method: "POST",
                 params: witData,
                 data: context
             })                  
            } 
            
        }
        }
    angular
        .module('chatbot')
        .factory('Wit', ['$http', Wit]);
})();