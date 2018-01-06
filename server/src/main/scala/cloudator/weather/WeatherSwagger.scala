package cloudator.weather

import org.json4s.{DefaultFormats, Formats}
import org.scalatra.ScalatraServlet
import org.scalatra.swagger.{NativeSwaggerBase, Swagger, ApiInfo}

class ResourcesListing(implicit val swagger: Swagger) extends ScalatraServlet with NativeSwaggerBase

object WeatherSwagger {
  val Info = ApiInfo(
    title="The Weather Service API",
    description="Automatically generated Weather APIs documentation.",
    termsOfServiceUrl="",
    contact="",
    license="",
    licenseUrl="")
}

class WeatherSwagger extends Swagger(Swagger.SpecVersion, "1", WeatherSwagger.Info)
