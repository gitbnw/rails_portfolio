//Firebase
(function() {
    function Messages($firebaseArray, $firebaseObject) {

        var ref = firebase.database().ref("messages")
         var messages = $firebaseArray(ref);



        return {
            allMessages: $firebaseArray(ref),

            getSessionMessages: function(sessionId) {
                var sessionRef = ref.orderByChild("session").equalTo(sessionId)
                var sessionMessages = $firebaseArray(sessionRef)

                return sessionMessages

            },
            
            send: function(newMessage) {
                // Send to firebase
                var messageRef = messages.$ref().child(Date.now() +"/");
                return messageRef.set(newMessage) //return Promise
            }
        }
    }
    angular
        .module('chatbot')
        .factory('Messages', ['$firebaseArray', '$firebaseObject', Messages]);
})();