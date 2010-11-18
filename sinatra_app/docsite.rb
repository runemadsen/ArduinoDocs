require 'rubygems'
require 'sinatra'
require 'models'

set :views, File.dirname(__FILE__) + '/views'

get "/circuits" do
  @circuits = Circuit.all
  erb :circuits_index
end

post "/components" do
  @component = Component.create_with_points! params[:component]
end

get "/circuits/:id" do
  @circuit = Circuit.get params[:id]
  erb :circuit_show
end

