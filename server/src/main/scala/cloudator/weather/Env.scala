package cloudator.weather

sealed trait Environment
case object Local extends Environment
case object Dev extends Environment
case object Test extends Environment
case object Prod extends Environment

object Env extends LoggingSupport {
  val env = System.getProperty("env", "dev") match {
    case "local" => Local
    case "test" => Test
    case "prod" => Prod
    case _ => Dev
  }
  info(s"starting in $env mode")
}

object EnvApp extends App {
  println(Env.env match {
    case Local => "in the Local mode"
    case Dev => "in the Dev mode"
    case Test => "in the Test mode"
    case Prod => "in the Production mode"
  })
}
