package cloudator.weather.common

import dispatch.Defaults.executor
import cloudator.weather.LoggingSupport

trait HttpClient extends LoggingSupport {
  import dispatch._, Defaults._

  def getListOfCities(queryTerm:String)(implicit endpoint: String) = {
    val now = System.currentTimeMillis
    val request = url(endpoint+"/search.json").addQueryParameter("key", "4abb83b31b604be4a14194425180301").addQueryParameter("q", queryTerm)  
    val call = Http(request)
    val response = call();
    val time = System.currentTimeMillis - now
    info(s"calling getListOfCities took ${time}ms to call "+request.url)    
    response
  }
  
  
   def getForecast(queryTerm:String)(implicit endpoint: String) = {
    val now = System.currentTimeMillis
    val request = url(endpoint+"/forecast.json").addQueryParameter("key", "4abb83b31b604be4a14194425180301").addQueryParameter("q", queryTerm).addQueryParameter("days", "5")  
    val call = Http(request)
    val response = call();
    val time = System.currentTimeMillis - now
    info(s"calling getForecast took ${time}ms to call "+request.url)    
    response
  }
   
}

