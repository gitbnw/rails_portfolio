 (function() {
     function HomeCtrl($scope, $firebaseArray, Messages, Auth, Wit) {
         var vm = this;
         var d = Date.now();
         var $chatfloor = $('#chat-floor');
         var $chatbox = $('#chat-box');

         $(document).ready(function() {
             var st = $('#side-toggle')
             st.show();
             st.click(function(e) {
                 e.preventDefault();
                 vm.initSession();
                 $("#wrapper").toggleClass("toggled");
             });
         });

         vm.updateScroll = function() {

             var bottom = $chatfloor.height();
             var remaining_height = parseInt(document.body.clientHeight - bottom);
             $chatbox.height(remaining_height);
             $chatbox.animate({
                 scrollTop: $chatbox.prop("scrollHeight")
             }, 300);

         };
         
         vm.delayQuickReplies = function(reply_count){
            var delay = (reply_count * 2 * 1000)
            $('#quickreplies-container').hide();
            $('#quickreplies-container')
              .delay(delay)
              .queue(function (next) { 
                $(this).css('display', 'flex'); 
                vm.updateScroll();
                next(); 
              });               
         };

         vm.sessionMessages = [];

         function randomIntFromInterval(min, max) {
             return Math.floor(Math.random() * (max - min + 1) + min);
         }

         $scope.session_id = null;
         $scope.formData = {};

         var witData = {
             v: d,
             q: "skynet online",
             type: "msg",
             reset: "true"
         };
         
         vm.auth = Auth;
         vm.prepMessage = function(role, message) {

             if (role === "bot") {
                 vm.messageData.role = "chatbot";
                 vm.messageData.sentAt = Date.now();
                 vm.messageData.content = message.text;
             } else {
                 vm.messageData.role = "human";
                 vm.messageData.quickreplies = null;
                 vm.messageData.sentAt = Date.now();
                 vm.messageData.content = $scope.formData.umsg;
             }
             return vm.messageData;

         };
         vm.replyCount = [];
         
         vm.showQuickRepliesLast = function(index) {
          vm.replyCount.push(index);
         };

         vm.handleBotReply = function(bot_reply) {

             if (bot_reply.quickreplies) {
                 vm.messageData.quickreplies = bot_reply.quickreplies;
                 
             }

             var preppedMessage = vm.prepMessage("bot", bot_reply);

             Messages.send(preppedMessage).then(function() {
                vm.updateScroll();
             });
         };

         vm.initSession = function() {

             vm.auth.$signInAnonymously().then(function(firebaseUser) {
                 $scope.firebaseUser = firebaseUser;
                 $scope.session_id = $scope.firebaseUser.uid + (new Date() / 1000);
                 $scope.wit_id = $scope.firebaseUser.uid + (new Date() / 1000);
                 witData.session_id = $scope.wit_id;
                 vm.sessionMessages = Messages.getSessionMessages($scope.session_id);
                 vm.messageData = {};
                 vm.messageData.session = $scope.session_id;
                var context = {};
                 Wit.converse(witData, context)
                     //call func to send response msg to firebase
                     .success(function(data, status, headers, config) {

                         witData.q = "";
                         vm.delayQuickReplies(data.length)

                         for (var i = 0; i < data.length; i++) {
                             vm.handleBotReply(data[i]);
                         };
                         vm.messageData.content = "";
                     });
             });
         };
         //sends to firebase, need for button
         vm.sendMessage = function(messageData) {
             return Messages.send(messageData, $scope.session_id);
         };

         //sends to Wit AI, need for button
         vm.messageWit = function(witData) {
             var context = {};
             return Wit.converse(witData, context);
         };

         vm.quickExchange = function(content, index) {
             $scope.formData.umsg = content;
             $scope.formData.option = index;
             vm.userExchange();
         };
         
         vm.cleverbotInit = function(omessage){
             var witData = {
                 v: d,
                 q: "jibberjabber",
                 type: "msg",
                 reset: "true",
                 omessage: omessage.content
             }; 
             var context = {
                 jibberjabber: "true"
             }
             witData.session_id = $scope.wit_id;
             
                 Wit.converse(witData, context)
                     .success(function(data, status, headers, config) {
                         witData.q = "";
                         vm.delayQuickReplies(data.length)
                         for (var i = 0; i < data.length; i++) {
                             vm.handleBotReply(data[i]);
                         };
                         vm.messageData.content = "";
                     });             
         },

         vm.userExchange = function() {
             var message = null
             vm.prepMessage("human", message);
             //send user message to firebase
             Messages.send(vm.messageData)
                 .then(function() {
                     $scope.formData = {}; //reset form
                     witData.q = vm.messageData.content; //send same msg to wit
                     witData.session_id = $scope.wit_id;
                     //send user message to wit
                     var context = {};
                     Wit.converse(witData, context)
                         .success(function(data, status, headers, config) {
                             // this data is the rendered json of the messages_controller #converse response
                             // if wit doesn't understand initialize cleverbot track
                             if (data[0].cleverbotInit) {
                                 vm.cleverbotInit(vm.messageData)
                             } else {
                                 vm.delayQuickReplies(data.length)
                                 for (var i = 0; i < data.length; i++) {
                                     vm.handleBotReply(data[i]);
                                 }
                             }
                         });
                 });
         };
     }
     angular
         .module('chatbot')
         .controller('HomeCtrl', ['$scope', '$firebaseArray', 'Messages', 'Auth', 'Wit', HomeCtrl]);
 })();