package cloudator.weather.common

import dispatch.Defaults.executor
import cloudator.weather.LoggingSupport
import cloudator.weather.Domain.WeatherServiceApiKey

trait HttpClient extends LoggingSupport {
  import dispatch._, Defaults._
  val apiKey=WeatherServiceApiKey.get
  def getListOfCities(queryTerm:String)(implicit endpoint: String) = {
    val now = System.currentTimeMillis
    val request = url(endpoint+"/search.json")
    .addQueryParameter("key", apiKey)
    .addQueryParameter("q", queryTerm)  
    val call = Http(request)
    val response = call();
    val time = System.currentTimeMillis - now
    info(s"calling getListOfCities took ${time}ms to call "+request.url)    
    response
  }
  
  // as of now Forecast is being checked for next 5 days (today+ next 5 days)
   def getForecast(queryTerm:String)(implicit endpoint: String) = {
    val now = System.currentTimeMillis
    val request = url(endpoint+"/forecast.json")
    .addQueryParameter("key", apiKey)
    .addQueryParameter("q", queryTerm)
    .addQueryParameter("days", "6")  
    val call = Http(request)
    val response = call();
    val time = System.currentTimeMillis - now
    info(s"calling getForecast took ${time}ms to call "+request.url)    
    response
  }
   
}