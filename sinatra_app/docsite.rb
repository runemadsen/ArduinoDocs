require 'rubygems'
require 'sinatra'
require 'models'

set :views, File.dirname(__FILE__) + '/views'

get "/circuits" do
  @circuits = Circuit.all
  erb :circuits_index
end

post "/components" do
  params[:points] = fix_params(params[:points])  
  @component = Component.create_with_points! params
end

get "/circuits/:id" do
  @circuit = Circuit.get params[:id]
  erb :circuit_show
end

def fix_params(params)
  params.collect do |k,v|
    {:x => v["x"].to_i, :y => v["y"].to_i}
  end
end
