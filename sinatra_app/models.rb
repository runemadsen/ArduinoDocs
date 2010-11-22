require 'dm-core'

#DataMapper.setup(:default, 'sqlite::memory:')
 DataMapper.setup(:default, 'sqlite:///Users/Rune/Projects/ArduinoDocs/Repositories/ArduinoDocs/sinatra_app/sqlite3.db')
#DataMapper.setup(:default, ENV['DATABASE_URL'] || 'mysql://localhost/arduino_docs')

class Circuit
  include DataMapper::Resource   
  
  property :id,           Serial
  property :video_url,    String
  
  has n, :components
  
  def to_json
    <<-JSON
    {
      "id" : #{self.id},
      "components" : [#{self.components.collect{|c| c.to_json}.join(",")}]
    }
    JSON
  end
end

class Component
  include DataMapper::Resource   
  
  property :id,           Serial
  property :name, String
  
  belongs_to :circuit
  has n, :points
  
  def self.create_with_points!(opts)
    circuit = Circuit.get opts[:circuit_id]
    component = circuit.components.create! :name => opts[:name]
    opts[:points].each do |p|
      component.points.create!( p) 
    end
    component
  end
  
  
  def to_json
    <<-JSON
    {"name" : "#{self.name}",
     "points" : [#{self.points.sort_by{|a| a.order }.collect{|p| p.to_json}.join(",")}]
    }
    JSON
  end
end

class Point
  include DataMapper::Resource   
  
  property :id,           Serial
  property :x, Integer
  property :y, Integer
  property :order, Integer

  belongs_to :component
  
  def to_json
    <<-JSON
      {"x" : #{self.x}, "y" : #{self.y}}
    JSON
  end
end