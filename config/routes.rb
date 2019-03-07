Rails.application.routes.draw do
  resources :to_dos
  get 'about', to: 'home#about', as: 'about'
  root to: 'home#index'
end
