import React, { Component, Fragment } from 'react'
import {
  Box,
  Container,
  Flex,
  Heading,
  Link as A,
  Text,
  Section,
  Icon,
  Button,
  Card
} from '@hackclub/design-system'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import Nav from 'components/Nav'
import Footer from 'components/Footer'
import MarkdownBody from 'components/MarkdownBody'
import { lowerCase, camelCase, isEmpty } from 'lodash'
import { org } from 'data.json'

const Name = Heading.h1.extend`
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.32);
  clip-path: polygon(4% 0%, 100% 0%, 96% 100%, 0% 100%);
  color: black;
  display: inline-block;
  mix-blend-mode: screen;
  padding-left: ${props => props.theme.space[4]}px;
  padding-right: ${props => props.theme.space[4]}px;
  width: max-content;
`

const Desc = Heading.h2.extend`
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.32);
`

const EditLink = A.extend.attrs({ color: 'white', f: 3 })`
  display: none;

  position: absolute;
  bottom: ${props => props.theme.space[3]}px;
  right: ${props => props.theme.space[4]}px;

  ${props => props.theme.mediaQueries.md} {
    display: inline-block;
  }
`

const Body = Container.withComponent(MarkdownBody)
A.link = A.withComponent(Link)
Section.h = Section.withComponent('header')

const generateSubtitle = (description, authorText) => {
  if (!authorText) {
    return description
  }

  // This iterates over each word in authorText, finds GitHub usernames (any
  // text that looks like "@orpheus", and turns them into links.
  const parsedAuthorText = authorText.split(' ').map((word, index, arr) => {
    const matches = word.match(/@(\w+)/)
    const processedWord = matches ? (
      <A
        href={`https://github.com/${matches[1]}`}
        target="_blank"
        color="white"
        children={word}
      />
    ) : (
      word
    )

    // This pads returned results with spaces, making our final array look the
    // following:
    //   [ 'Hack', ' ', 'Club', ' ', 'staff' ]
    // if last item in array, don't give an extra space
    return index === arr.length - 1 ? processedWord : [processedWord, ' ']
  })

  return (
    <Fragment>
      {description}. Created by {parsedAuthorText}.
    </Fragment>
  )
}

const BreadcrumbList = Flex.withComponent('ol').extend`
  list-style: none;
  padding-left: 0;
`
const Breadcrumbs = props => (
  <BreadcrumbList
    itemScope
    itemType="http://schema.org/BreadcrumbList"
    {...props}
  />
)
const Breadcrumb = ({ type = 'Thing', position, name, ...props }) => (
  <li
    itemProp="itemListElement"
    itemScope
    itemType="http://schema.org/ListItem"
  >
    <A.link
      itemScope
      itemType={`http://schema.org/${type}`}
      itemProp="item"
      color="white"
      f={3}
      bold
      caps
      {...props}
    >
      <span itemProp="name" children={name} />
    </A.link>
    <meta itemProp="position" content={position} />
  </li>
)
const BreadcrumbDivider = () => (
  <Text.span mx={2} color="snow" f={3} children="›" />
)

const githubEditUrl = slug =>
  `https://github.com/hackclub/hackclub/edit/master${slug}/README.md`
const twitterURL = (text, url) =>
  `https://twitter.com/intent/tweet?text=${text
    .split(' ')
    .join('%20')}&url=${url}`
const facebookURL = (text, url) =>
  `https://www.facebook.com/sharer/sharer.php?u=${url}`

const InlineButton = Button.extend`
  display: inline-flex;
  align-items: center;
  div {
    background-image: url(/social/${props => lowerCase(props.service)}-white.svg);
    background-repeat: no-repeat;
    background-size: 100%;
    width: 18px;
    height: 18px;
  }
`
const ShareButton = props => (
  <InlineButton target="_blank" title={`Share on ${props.service}`} {...props}>
    <Box mr={2} />
    {props.service}
  </InlineButton>
)

const makeUrl = (domain, slug) => `https://${domain}${slug}`

export default ({ data }) => {
  if (isEmpty(data)) return null

  const {
    fields: { slug, bg },
    frontmatter: { name, description, author = '', group = 'start', order = 1 },
    html
  } = data.markdownRemark

  const subtitle = generateSubtitle(description, author)

  const title = `${name} – Hack Club Workshops`
  const desc = `${description}. Read the tutorial on Hack Club Workshops.`
  const url = makeUrl('hackclub.com', slug)

  const authorUsername = author.toString().match(/@(\S+)/)
    ? author.replace('@', '')
    : 'hackclub'
  const authorUrl = makeUrl('github.com', authorUsername)

  const schema = {
    '@context': 'http://schema.org',
    '@type': 'HowTo',
    headline: name,
    image: [makeUrl('hackclub.com', bg)],
    author: {
      '@type': 'Person',
      name: author,
      url: authorUrl
    },
    publisher: org,
    url,
    description,
    genre: group,
    position: order,
    educationalUse: 'assignment',
    isAccessibleForFree: true,
    potentialAction: {
      '@type': 'CreateAction',
      result: {
        '@type': 'CreativeWork',
        name
      }
    }
  }

  return (
    <Fragment>
      <Helmet
        title={title}
        meta={[
          { name: 'description', content: desc },
          { property: 'og:title', content: title },
          { name: 'twitter:title', content: title },
          { property: 'og:description', content: desc },
          { name: 'twitter:description', content: desc },
          { property: 'og:site_name', content: 'Hack Club Workshops' },
          { property: 'og:url', content: url }
        ]}
        children={
          <script
            type="application/ld+json"
            children={JSON.stringify(schema)}
          />
        }
      />
      <Section.h
        bg="accent"
        p={0}
        style={{ backgroundImage: `url('${bg}')`, position: 'relative' }}
      >
        <Nav style={{ position: 'absolute', top: 0 }} />
        <Container mt={4} mb={3} px={3}>
          <Breadcrumbs align="center" justify="center" my={3}>
            <Breadcrumb to="/workshops" name="Workshops" position={1} />
            <BreadcrumbDivider />
            <Breadcrumb to={`/workshops#${group}`} name={group} position={2} />
            <BreadcrumbDivider />
            <Breadcrumb to={url} name={name} position={3} bold={false} />
          </Breadcrumbs>
          <Name f={[5, 6]} mb={2} children={name} />
          <Desc f={[3, 4]} regular children={subtitle} />
        </Container>
        <EditLink href={githubEditUrl(slug)} target="_blank">
          <Icon color="white" name="edit" mb={-1} /> Edit on GitHub
        </EditLink>
      </Section.h>
      <Body maxWidth={48} p={3} dangerouslySetInnerHTML={{ __html: html }} />
      <Container maxWidth={32} p={3} mb={4}>
        <Card bg="blue.0" p={4} align="center">
          <Heading.h2 f={3} color="accent" caps>
            Made something rad?
          </Heading.h2>
          <Heading.h2 color="primary" f={5}>
            Share it! 🌟
          </Heading.h2>
          <Text f={1} color="muted" mb={3}>
            (posts are editable)
          </Text>
          <ShareButton
            service="Twitter"
            href={twitterURL(
              `I just built ${name} with a @starthackclub workshop. Make yours:`,
              url
            )}
            bg="#1da1f2"
            mr={3}
          />
          <ShareButton
            service="Facebook"
            href={facebookURL(url)}
            bg="#3b5998"
          />
        </Card>
      </Container>
      <Footer />
    </Fragment>
  )
}
export const pageQuery = graphql`
  query WorkshopBySlug($path: String!) {
    markdownRemark(fields: { slug: { eq: $path } }) {
      html
      fields {
        slug
        bg
      }
      frontmatter {
        name
        description
        author
        group
        order
      }
    }
  }
`
