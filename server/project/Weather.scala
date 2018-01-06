import sbt._
import Keys._
import org.scalatra.sbt._
import org.scalatra.sbt.PluginKeys._
import com.earldouglas.xsbtwebplugin.PluginKeys._

object WeatherBuild extends Build {
  val Organization = "cloudator"
  val Name = "weatherservice"  
  val ScalaVersion = "2.11.2"
  val ScalatraVersion = "2.3.0"

  lazy val project = Project (
    "weather",
    file("."),
    settings = Defaults.defaultSettings ++ ScalatraPlugin.scalatraWithJRebel ++ (net.virtualvoid.sbt.graph.Plugin.graphSettings) ++ Seq(
      webappResources in Compile := Seq(file("src/main/webapp"), file("../ui/dist")),
      organization := Organization,
      name := Name,      
      scalaVersion := ScalaVersion,
      resolvers += Classpaths.typesafeReleases,
      resolvers += "code.lds.org" at "https://code.lds.org/nexus/content/groups/main-repo",
      resolvers += Opts.resolver.sonatypeSnapshots,
      libraryDependencies ++= Seq(
        "org.json4s"   %% "json4s-native" % "3.2.10",
        "org.scalatra" %% "scalatra" % ScalatraVersion,
        "org.scalatra" %% "scalatra-swagger"  % ScalatraVersion,
        "org.scalatra" %% "scalatra-specs2" % ScalatraVersion % "test",
        "net.databinder.dispatch" %% "dispatch-core" % "0.11.1",
        "com.typesafe.akka" %% "akka-actor" % "2.3.4",
        "org.slf4j" % "slf4j-api" % "1.7.5",
        "org.slf4j" % "slf4j-simple" % "1.7.5",
        "org.clapper" %% "grizzled-slf4j" % "1.0.2",
        // To run tests from Eclipse?
        "junit" % "junit" % "4.11" % "test",
        "org.eclipse.jetty" % "jetty-webapp" % "8.1.8.v20121106" % "container",
        "org.eclipse.jetty.orbit" % "javax.servlet" % "3.0.0.v201112011016" % "container;provided;test" artifacts (Artifact("javax.servlet", "jar", "jar")),
        "org.eclipse.jetty" % "jetty-servlets" % "8.1.8.v20121106" % "test"        
      )
    )
  )
}
