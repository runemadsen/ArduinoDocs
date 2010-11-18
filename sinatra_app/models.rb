require 'dm-core'

#DataMapper.setup(:default, 'sqlite::memory:')
# DataMapper.setup(:default, 'sqlite:////Users/greg/code/sinatra/sqlite3.db')
DataMapper.setup(:default, ENV['DATABASE_URL'] || 'mysql://localhost/arduino_docs')

class Circuit
  include DataMapper::Resource   
  
  property :id,           Serial
  property :video_url,    String
  
  has n, :components
  
  def to_json
    <<-JSON
    {
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
  
  def to_json
    <<-JSON
    {"name" : "#{self.name}",
     "points" : [#{self.points.sort_by{|a| a.position }.collect{|p| p.to_json}.join(",")}]
    }
    JSON
  end
end

class Point
  include DataMapper::Resource   
  
  property :id,           Serial
  property :x, Integer
  property :y, Integer
  property :position, Integer

  belongs_to :component
  
  def to_json
    <<-JSON
      {"x" : #{self.x}, "y" : #{self.y}}
    JSON
  end
end