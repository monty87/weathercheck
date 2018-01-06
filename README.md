# Cloudator Weather Service
 
Cloudator Weather Service is an application that monitors weather forecasts for specific locations

Project is split into two parts:
- Scala backend, server/
- AngularJS admin frontend, ui/


## Log file location

In project, under src -> main-> resources -> simplelogger.properties. Open this file to change to the desired location.


## Start the frontend

For running this project, both backend and frontends  needs to be started separately


```sh
cd server
./sbt
# in sbt prompt
container:start

```


## Start the frontend
Install [dependencies](ui/README.md)

```sh
cd ui
grunt server
```

## Browse it

Scala backend listens on port 8080.
Grunt development server listens on port 3333.

Interesting urls, these require both backend and frontend running

- Weather Service Gui: (http://localhost:3333)
- Weather Service Swagger documentation: (http://localhost:3333/docs)

	List of apis created 

    get /api/weatherservice/checkForecastPeriodically :->  Checks Forecasts of list of cities periodically based on time input by user            
    get /api/weatherservice/forecast/{lat}/{lon} :-> Retrieve forecast details of a city based on Latitude and Longitude provided by user    
    get /api/weatherservice/forecastDetails :-> Retrieve forecast details for a list of cities
    get /api/weatherservice/location :-> Retieve a list of matching cities




# Environments

Weather Service tries to be a portable app. There is a `cloudator.weather.Env` which hold the environment information. There are the following environments: `Local`, `Dev`, `Test` and `Prod`. One can set the environment by setting the JVM System Property `env`. Used pattern matching in reading the env:

```scala

val env = System.getProperty("env", "dev") match {
    case "local" => Local
    case "test" => Test
    case "prod" => Prod
    case _ => Dev
  }


object WeatherServiceUrl {
  def get = Env.env match {
    case Prod => "http://api.apixu.com/v1"
    case Test => "http://api.apixu.com/v1"
    case Local => "http://api.apixu.com/v1"
      case _ => "http://api.apixu.com/v1"

  }
}  
}

  
````

To change the env in while developing, type in the sbt console:

```scala
eval System.setProperty("env", "local")
```



# Things still to be done
 
 1) Test cases are yet to be written
 2) Better handling of actors where in scheduler can be stopped instead of system.shutdown()
 3) In GUI, limit selection and status check feature to be developed

