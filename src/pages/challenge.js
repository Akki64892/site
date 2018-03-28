import React, { Fragment } from 'react'
import {
  Box,
  Flex,
  Container,
  Heading,
  Text,
  Section,
  Card
} from '@hackclub/design-system'
import Helmet from 'react-helmet'
import Nav from 'components/Nav'
import Form from 'components/challenge/Form'
import Posts from 'components/challenge/Posts'
import { isEmpty } from 'lodash'

const Header = Section.withComponent('header').extend`
  padding-top: 0 !important;
  background-color: ${props => props.theme.colors.red[5]};
  background-image: linear-gradient(
    32deg,
    ${props => props.theme.colors.pink[5]},
    ${props => props.theme.colors.red[5]}
  );
  clip-path: polygon(0% 0%, 100% 0, 100% 100%, 0 98%);
  ${props => props.theme.mediaQueries.md} {
    clip-path: polygon(0% 0%, 100% 0, 100% 100%, 0 92%);
  }
`

const HeaderContainer = Container.extend`
  display: grid;
  grid-gap: ${props => props.theme.space[3]}px;
  ${props => props.theme.mediaQueries.md} {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: ${props => props.theme.space[4]}px;
  }
`

const HeaderCard = Card.extend`
  max-width: 24rem;
  h2,
  p {
    color: ${props => props.theme.colors.black} !important;
  }
`

const dt = d => new Date(d).toLocaleDateString()

export default ({ data }) => {
  if (isEmpty(data)) return null
  const challenge = data.publicJson
  return (
    <Fragment>
      <Helmet title="Challenge – Hack Club" />
      <Header p={3}>
        <Nav />
        <HeaderContainer p={0} mt={3} align="left">
          <Box align={['center', null, 'right']}>
            <Text mb={-2} f={3} bold caps>
              Hack Club
            </Text>
            <Heading.h1 f={[6, 7]} mt={0} mb={3}>
              Challenge
            </Heading.h1>
            <HeaderCard boxShadowSize="md" p={3} bg="pink.0" align="left">
              <Text f={2}>
                🌟 Challenge of the month is <strong>{challenge.name}</strong>
                <br />
                🎁 {challenge.description}
                <br />
                📈 Upvote your favorites!
                <br />
                🏅 Top-voted 3 websites by {dt(challenge.end)} win!
              </Text>
            </HeaderCard>
          </Box>
          <HeaderCard boxShadowSize="md" p={3} bg="pink.0">
            <Form />
          </HeaderCard>
        </HeaderContainer>
      </Header>
      <Container maxWidth={48} py={4} px={3}>
        <Flex align="center" mb={3}>
          <Heading.h2 f={[4, 5]}>Submissions</Heading.h2>
          <Text.span f={2} color="muted" ml={3}>
            {dt(challenge.start)} – {dt(challenge.end)}
          </Text.span>
        </Flex>
        <Posts challengeId={challenge.id} />
      </Container>
    </Fragment>
  )
}
export const pageQuery = graphql`
  query ChallengeQuery {
    publicJson {
      id
      name
      description
      start
      end
    }
  }
`
