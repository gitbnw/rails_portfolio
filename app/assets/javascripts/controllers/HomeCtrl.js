 (function() {
     function HomeCtrl($scope, $firebaseArray, Messages, Auth, Wit) {
         var vm = this;
         var d = Date.now();
         var form = document.getElementById("messageForm");

         vm.updateScroll = function() {
             var bottom = $('.chat-floor').height();
             var remaining_height = parseInt(document.body.clientHeight - bottom);
             console.log('resize')
             $('.chat-box').height(remaining_height);
             var chatboxEl = document.getElementById("chat-box");
             $('.chat-box').animate({
                 scrollTop: $('.chat-box')[0].scrollHeight - $('.chat-box')[0].clientHeight
             }, 1000);

         };
         var sideToggleEl = document.getElementById("#side-toggle");
         var wrapperEl = document.getElementById("#wrapper");

         vm.sessionMessages = []



         sideToggleEl.addEventListener('click', function(e) {
             e.preventDefault();
             $("#wrapper").toggleClass("toggled");
         });

         function randomIntFromInterval(min, max) {
             return Math.floor(Math.random() * (max - min + 1) + min);
         }

         $scope.session_id = null
         $scope.formData = {};

         var witData = {
             v: d,
             q: "skynet online",
             type: "msg",
             reset: "true"
         }
         vm.auth = Auth;
         vm.prepMessage = function(role, message = null) {
             if (role === "bot") {
                 vm.messageData.role = "chatbot";
                 vm.messageData.sentAt = Date.now();
                 vm.messageData.content = message.text
             } else {
                 vm.messageData.role = "human";
                 vm.messageData.quickreplies = null;
                 vm.messageData.sentAt = Date.now();
                 vm.messageData.content = $scope.formData.umsg
             }
             return vm.messageData

         }

         vm.handleBotReply = function(bot_reply) {
             //the bot will converse until it gets a stop
             if (bot_reply.quickreplies) {
                 vm.messageData.quickreplies = bot_reply.quickreplies;
             }
             var preppedMessage = vm.prepMessage("bot", bot_reply)
             Messages.send(preppedMessage).then(function() {
                 // vm.updateScroll();
             })
         }
         vm.auth.$signInAnonymously().then(function(firebaseUser) {
                 $scope.firebaseUser = firebaseUser;
                 $scope.session_id = $scope.firebaseUser.uid
                 $scope.wit_id = $scope.firebaseUser.uid + randomIntFromInterval(1, 99)
                 witData.session_id = $scope.wit_id
                     // create a query for messages related to session
                 vm.sessionMessages = Messages.getSessionMessages($scope.session_id)

                 //quick replies should only show for last session message
                 // vm.lastSessionMessage = Messages.getLastSessionMessage($scope.session_id)
                 vm.messageData = {};
                 vm.messageData.session = $scope.session_id

                 Wit.converse(witData)
                     //call func to send response msg to firebase
                     .success(function(data, status, headers, config) {
                         witData.q = ""
                         for (var i = 0; i < data.length; i++) {
                             vm.handleBotReply(data[i]);
                         }
                         vm.messageData.content = "";
                     })
             })
             //sends to firebase, need for button
         vm.sendMessage = function(messageData) {
             return Messages.send(messageData, $scope.session_id)
         };

         //sends to Wit AI, need for button
         vm.messageWit = function(witData) {
             return Wit.converse(witData);
         };

         vm.quickExchange = function(content, index) {
             $scope.formData.umsg = content;
             $scope.formData.option = index
             vm.userExchange();
         };

         vm.userExchange = function() {
             vm.prepMessage("human")
                 //send user message to firebase
             Messages.send(vm.messageData)
                 .then(function() {
                     $scope.formData = {}; //reset form
                     witData.q = vm.messageData.content; //send same msg to wit
                     witData.session_id = $scope.wit_id;
                     //send user message to wit
                     Wit.converse(witData)
                         .success(function(data, status, headers, config) {
                             for (var i = 0; i < data.length; i++) {
                                 setTimeout(function(i, data) {
                                     return function() {
                                         vm.handleBotReply(data[i])

                                     };
                                 }(i, data), 1000 * i);
                             }
                         })
                 })
         };
     }
     angular
         .module('chatbot')
         .controller('HomeCtrl', ['$scope', '$firebaseArray', 'Messages', 'Auth', 'Wit', HomeCtrl]);
 })();