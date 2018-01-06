package cloudator.weather.service

import cloudator.weather.LoggingSupport
import cloudator.weather.common.HttpClient
import org.json4s._
import org.json4s.native.JsonMethods._
import org.json4s.NoTypeHints


object WeatherServiceOperations extends LoggingSupport with HttpClient  {
  import cloudator.weather.Domain._
  
  implicit val endpoint = s"${WeatherServiceUrl.get}"
  implicit val formats = DefaultFormats
  
  def retrieveLocations(queryTerm:String) = {
    parse(getListOfCities(queryTerm).getResponseBody).extract[List[Location]]   
  }
  
  def retrieveForecastDetails(lat:String,lon:String) = {
    parse(getForecast(lat+","+lon).getResponseBody).extract[ForecastDetails]   
  }
  
  def compareLocationsWithLimit(queryTerm:String) = {
    // have to write logic for comparison as well
   val locationLimit=queryTerm.split("::") 
   val forecastResponse= parse(getForecast(locationLimit(0)).getResponseBody).extract[ForecastDetails]
   val locationLimitList= forecastResponse.forecast.forecastday.map(locationForecast=> {
     // rounding minTemp string value as we dont have to deal with minor change in temperature
     val limitTemperature=  locationLimit(1).toFloat.round
     val maxTemperature=  locationForecast.day.maxtemp_c.toFloat.round
     val status= if (maxTemperature > limitTemperature) "Increase" else if (maxTemperature > limitTemperature) "Same" else "Decrease"       
     LocationLimit(locationForecast.date,locationForecast.day.maxtemp_c,locationForecast.day.mintemp_c,locationLimit(1),status)
   })
   val locationLimitMap = Map[String, List[LocationLimit]](forecastResponse.location.name -> locationLimitList)   
   info("periodic status is "+locationLimitMap)
   locationLimitMap
  }
}