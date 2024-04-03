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
    statusCode: apiStatusConstants.initial,
    ageList: [],
    genderList: [],
    coverageList: [],
  }

  componentDidMount() {
    this.getVaccination()
  }

  convertCoverageData = each => ({
    vaccineDate: each.vaccine_date,
    dose1: each.dose_1,
    dose2: each.dose_2,
  })

  convertAgeData = data => ({
    age: data.age,
    count: data.count,
  })

  convertGenderData = each => ({
    count: each.count,
    gender: each.gender,
  })

  getVaccination = async () => {
    this.setState({statusCode: apiStatusConstants.inProgress})

    const response = await fetch('https://apis.ccbp.in/covid-vaccination-data')
    if (response.ok === true) {
      const data = await response.json()
      const coverageData = data.last_7_days_vaccination.map(each =>
        this.convertCoverageData(each),
      )
      const ageData = data.vaccination_by_age.map(each =>
        this.convertAgeData(each),
      )
      const genderData = data.vaccination_by_gender.map(each =>
        this.convertGenderData(each),
      )
      this.setState({
        coverageList: coverageData,
        ageList: ageData,
        genderList: genderData,
        statusCode: apiStatusConstants.success,
      })
    } else {
      this.setState({statusCode: apiStatusConstants.failure})
    }
  }

  renderVaccinationDetails = () => {
    const {coverageList, ageList, genderList} = this.state

    return (
      <>
        <ul className="list_container">
          {coverageList.map(eachItem => (
            <VaccinationCoverage
              coverageDetails={eachItem}
              key={eachItem.vaccineDate}
            />
          ))}
        </ul>
        <ul className="list_container">
          {genderList.map(eachItem => (
            <VaccinationByGender
              genderDetails={eachItem}
              key={eachItem.count}
            />
          ))}
        </ul>
        <ul className="list_container">
          {ageList.map(eachItem => (
            <VaccinationByAge genderDetails={eachItem} key={eachItem.count} />
          ))}
        </ul>
      </>
    )
  }

  renderPrimeDealsFailureView = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="register-prime-image"
      />
      <h1>Something went wrong</h1>
    </>
  )

  renderLoader = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderAllCharts = () => {
    const {statusCode} = this.state

    switch (statusCode) {
      case apiStatusConstants.success:
        return this.renderVaccinationDetails()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg_container">
        <div className="logo_container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logo_image"
          />
          <p className="paragraph">Co-WIN</p>
        </div>
        <h1>CoWIN Vaccination in India</h1>
        {this.renderAllCharts()}
      </div>
    )
  }
}
export default CowinDashboard
