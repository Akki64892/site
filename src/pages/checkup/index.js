import React, { Component, Fragment } from 'react'
import Login from 'components/apply/Login'
import LoadingBar from 'components/LoadingBar'
import ErrorPage from 'components/admin/ErrorPage'
import Nav from 'components/apply/ApplyNav'
import LeaderForm from 'components/checkup/LeaderForm'
import api from 'api'
import {
  Container,
  Card,
  Link,
  Text,
  Heading,
  Section
} from '@hackclub/design-system'

export default class extends Component {
  state = {
    status: 'loading'
  }

  componentDidMount() {
    api
      .get('v1/users/current')
      .then(user => {
        this.setState({ user })
        return api
          .get(`v1/new_leaders/${user.new_leader.id}/new_clubs`)
          .then(clubs => {
            const urlBase = location.origin + location.pathname
            const clubUrl = `${urlBase}/club?id=${clubs[0].id}`
            const clubsUrl = `${urlBase}/clubs`
            this.setState({
              clubs,
              status: 'success',
              redirectUrl: clubs.length === 1 ? clubUrl : clubsUrl
            })
          })
      })
      .catch(err => {
        if (err.status === 401) {
          this.setState({ status: 'needsToAuth' })
        } else {
          this.setState({ status: 'error' })
        }
      })
  }

  render() {
    const { status, redirectUrl } = this.state
    switch (status) {
      case 'loading':
        return <LoadingBar fill />
      case 'success':
        return (
          <Fragment>
            <Nav />
            <Section bg="primary" color="white">
              <Heading.h1 f={[5, 6]} mb={[2, 3]}>
                It’s the end of the school year! 🎉
              </Heading.h1>
              <Text f={[2, 3]}>
                Time to update your club and leader’s info.
              </Text>
            </Section>
            <Container color="black" p={3} maxWidth={36}>
              <Heading.h3 f={4} mt={3} mb={2}>
                Update your profile
              </Heading.h3>
              <Card boxShadowSize="sm" p={3}>
                <LeaderForm {...this.state.user} redirectUrl={redirectUrl} />
              </Card>
            </Container>
          </Fragment>
        )
      case 'needsToAuth':
        return <Login heading="Sign in to view" />
      default:
        return <ErrorPage />
    }
  }
}
