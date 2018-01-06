package cloudator.weather

import scala.xml.Elem
import org.json4s.Serialization
import org.json4s.Reader
import org.json4s.NoTypeHints
  
object Domain {
   
case class LocationLimit(    
    date:              String, 
    maxtemp_c:            String,  
    mintemp_c:           String, 
    limit:               String,
    checkStatus :        String
   )  
 
case class Location(    
    name:              String, 
    region:            String,  
    country:           String, 
    lat:               String,  
    lon:               String
   ) 
  case class Current(    
    last_updated:       String, 
    condition:         Condition,  
    temp_c:             String, 
    temp_f:             String      
   ) 
   case class Condition(text:String) 
   case class Forecastday(forecastday:List[innerDay])   
   case class innerDay(date: String,day:Day)
   case class Day(    
    maxtemp_c:         String,
    maxtemp_f:         String,
    mintemp_c:         String,
    mintemp_f:         String,
    condition:         Condition
    ) 
    
   case class ForecastDetails(    
    location:    Location, 
    current:     Current,
    forecast: Forecastday
   ) 
   
   
   
object WeatherServiceUrl {
  def get = Env.env match {
    case Prod => "http://api.apixu.com/v1"
    case Test => "http://api.apixu.com/v1"
    case Local => "http://api.apixu.com/v1"
      case _ => "http://api.apixu.com/v1"

  }
}  


object WeatherServiceApiKey {
  def get = Env.env match {
    case Prod => "4abb83b31b604be4a14194425180301"
    case Test => "4abb83b31b604be4a14194425180301"
    case Local => "4abb83b31b604be4a14194425180301"
      case _ => "4abb83b31b604be4a14194425180301"

  }
} 

}
