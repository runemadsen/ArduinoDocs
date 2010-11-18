require 'rubygems'
require 'sinatra'
require 'models'

set :views, File.dirname(__FILE__) + '/views'

get "/circuits" do
  @circuits = Circuit.all
  erb :circuits_index
end

get "/circuits/:id" do
  @circuit = Circuit.get params[:id]
  erb :circuit_show
end

