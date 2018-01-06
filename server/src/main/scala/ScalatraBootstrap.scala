import org.scalatra.LifeCycle
import cloudator.weather.{WeatherSwagger, ResourcesListing}
import cloudator.weather.service.WeatherApiController
import javax.servlet.ServletContext
import akka.actor.ActorSystem
import akka.actor.Props
import akka.util.Timeout
import javax.servlet.http.HttpServlet
import org.scalatra.servlet.ScalatraAsyncSupport

class ScalatraBootstrap extends LifeCycle {

  implicit val system = ActorSystem()
  implicit val swagger = new WeatherSwagger

  override def init(context: ServletContext) {
    context.mount(new ResourcesListing,                "/api-docs/*") // must be the first line in order to work with app-servers having a context-path
    context.mount(new WeatherApiController,              "/api/weatherservice/*",    "api/weatherservice")
  }

  override def destroy(context: ServletContext) {
    system.shutdown()
  }
}
