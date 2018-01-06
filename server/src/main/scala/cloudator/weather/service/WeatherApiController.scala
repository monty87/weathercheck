package cloudator.weather.service


import org.scalatra.swagger.Swagger
import cloudator.weather.Domain._
import cloudator.weather.WeatherStack
import akka.actor.{Props, ActorSystem}
import scala.concurrent.duration._
import scala.concurrent.ExecutionContext


class WeatherApiController(implicit val swagger: Swagger, implicit val system: ActorSystem) extends WeatherStack {
  protected val applicationDescription = "Location Weather info JSON API."
  
  protected implicit def executor: ExecutionContext = system.dispatcher
  val weatherActor = system.actorOf(Props[WeatherActor])
  
  get("/location", operation(
    apiOperation[List[Location]]("retrieveLocations")
    parameters (queryParam[String]("q").description("search term. Enter city name here").required)
    summary "Retieve a list of matching cities")) {
    val searchTerm=params("q")
    info(s"calling location autocomplete API with queryParam : ${searchTerm}") 
    WeatherServiceOperations.retrieveLocations(searchTerm)
  }

  get("/forecast/:lat/:lon", operation(
    apiOperation[ForecastDetails]("retrieveForecastByLatLon")
    parameters (pathParam[String]("lat").description("Latitude").required) 
    parameters (pathParam[String]("lon").description("Longitude").required) 
    summary "Retrieve forecast details of a city based on Latitude and Longitude provided by user")) {
     val latitude=params("lat")
     val longitude=params("lon")
     info(s"calling forecast by lat & lon API with queryParam : ${latitude} and ${longitude}") 
     WeatherServiceOperations.retrieveForecastDetails(latitude,longitude)
  } 
  
  
   get("/forecastDetails", operation(
    apiOperation[Seq[Map[String,LocationLimit]]]("retrieveForecastDetails")
    parameters (queryParam[String]("searchTerm").multiValued.description("list of (locations::limits) as comma-separated list. Location and limit are separed by :: For example paris::10,london::5")) 
    summary "Retrieve forecast details for a list of cities")) {  
     val paramList=multiParams("searchTerm")
     info(s"calling forecastDetails API for list of queryParam : ${paramList} ") 
     paramList.flatten(_.split(",")).map(_.trim).map(WeatherServiceOperations.compareLocationsWithLimit)
  } 
  
   
   get("/checkForecastPeriodically", operation(
    apiOperation[Boolean]("checkForecastPeriodically")
    parameters (queryParam[String]("searchTerm").multiValued.description("list of (locations::limits) as comma-separated list. Location and limit are separed by :: For example paris::10,london::5")) 
    parameters (queryParam[Int]("time").description("Mention Interval time here (in seconds) . for example 5 will be 5 seconds"))
    summary "Checks Forecasts of list of cities periodically based on time input by user")) {
     val paramList=multiParams("searchTerm")
     val schedulerTime= params("time").toInt
     info(s"calling checkPeriodically API for list of queryParam : ${paramList}  and schedule time : ${schedulerTime}")
     system.scheduler.schedule(0 seconds,schedulerTime seconds,weatherActor,paramList)
  }  
}
