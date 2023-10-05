// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    isLoading: true,
    vaccinationByAgeData: [],
    vaccinationByGenderData: [],
    vaccinationCoverageData: [],
  }

  componentDidMount() {
    this.fetchData()
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  fetchData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const covidVaccinationDataApiUrl =
      'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(covidVaccinationDataApiUrl)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedVaccinationCoverageData = fetchedData.last_7_days_vaccination
      const updatedVaccinationByGenderData = fetchedData.vaccination_by_gender
      const updatedVaccinationByAgeData = fetchedData.vaccination_by_age
      //   console.log(vaccinationCoverageData)
      //   console.log(fetchedData)

      this.setState({
        apiStatus: apiStatusConstants.success,
        vaccinationCoverageData: updatedVaccinationCoverageData,
        vaccinationByAgeData: updatedVaccinationByAgeData,
        vaccinationByGenderData: updatedVaccinationByGenderData,
        isLoading: false,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderVaccinationStats = () => {
    const {
      isLoading,
      vaccinationByGenderData,
      vaccinationCoverageData,
      vaccinationByAgeData,
    } = this.state

    return (
      <div className="recharts-container">
        {isLoading ? (
          <div data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
          </div>
        ) : (
          <div>
            <VaccinationCoverage
              vaccinationCoverageDataDetails={vaccinationCoverageData}
            />
            <VaccinationByGender
              vaccinationByGenderDataDetails={vaccinationByGenderData}
            />
            <VaccinationByAge
              vaccinationByAgeDataDetails={vaccinationByAgeData}
            />
          </div>
        )}
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loading-view" data-testid="loader">
      <Loader color="#ffffff" height={80} type="ThreeDots" width={80} />
    </div>
  )

  renderViewsBasedOnAPIStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderVaccinationStats()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    // console.log(vaccinationCoverageData)
    // console.log(vaccinationByAgeData)
    // console.log(vaccinationByGenderData)
    return (
      <div className="bg-container">
        <div className="logo-cont">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="website-logo"
          />
          <p className="website-name">Co-WIN</p>
        </div>
        <h1 className="heading">CoWIN Vaccination In India</h1>

        {this.renderViewsBasedOnAPIStatus()}
      </div>
    )
  }
}

export default CowinDashboard
