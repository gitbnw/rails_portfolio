Rails.application.routes.draw do

  root to: 'application#angular'
  get '*unmatched_route', :to => 'application#angular'

  resources :messages, only: [:index, :show]
  post '/converse' => 'messages#converse'

end
