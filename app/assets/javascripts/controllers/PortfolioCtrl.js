 (function() {
     function PortfolioCtrl() {
         var vm = this;
         var st = $('#side-toggle')
         st.hide();
     }
     angular
         .module('chatbot')
         .controller('PortfolioCtrl', [PortfolioCtrl]);
 })();