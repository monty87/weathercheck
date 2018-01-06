package cloudator.weather

import org.json4s._
import org.scalatra.ScalatraServlet
import org.scalatra.json.NativeJsonSupport
import org.scalatra.swagger.SwaggerSupport
import grizzled.slf4j.{Logger, Logging}

trait WeatherStack extends ScalatraServlet with NativeJsonSupport 
with SwaggerSupport with LoggingSupport with ExceptionHandling with ResponseHandling {

  protected implicit val jsonFormats: Formats = DefaultFormats

  before() {
    contentType = formats("json")
    response.setHeader("Cache-Control", "no-cache")
  }
}

trait ResponseHandling extends ScalatraServlet {
  def fail(code: Int, message: String) = halt(code, Map("message" -> message))
}

trait ExceptionHandling extends ResponseHandling {
  error {
    case t: Throwable => {
      Logger(getClass).error(t.getMessage(), t)
      fail(400, t.getMessage())
    }
  }
}

trait LoggingSupport extends Logging