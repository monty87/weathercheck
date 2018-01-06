package cloudator.weather.service

import akka.actor.Actor
import akka.actor.ActorSystem
import akka.actor.Props
import scala.concurrent.duration._

object WeatherActor {
  case class Ping()
  case class Pong(ping: String = "pong")
}

class WeatherActor extends Actor {
  import WeatherActor._

  def receive = {
    case queryTerm : Seq[String] => queryTerm.flatten(_.split(",")).map(_.trim).map(WeatherServiceOperations.compareLocationsWithLimit) 
      
  }
}

