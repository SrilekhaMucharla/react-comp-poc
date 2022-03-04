//Jenkinsfile
@org.jenkinsci.plugins.workflow.libs.Library('jLibrary.hastingsdirect') _

properties([
  disableConcurrentBuilds()
])

try {
  continuousBuildQnB()
} catch (Exception mainJobError) {
  println(mainJobError.printStackTrace())
  error("${mainJobError}")
}