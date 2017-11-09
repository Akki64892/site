import React from 'react'
import { Box, Flex, Text } from 'rebass'
import theme, { colors } from '../theme'
import Button from './Button'

const chevron = () => {
  const props = `xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'`
  const slate = colors.slate.replace('#', '')
  const pathProps = `fill='%23${slate}' d='M2 0L0 2h4zm0 5L0 3h4z'`
  return `%3Csvg ${props}%3E%3Cpath ${pathProps}/%3E%3C/svg%3E`
}
export const Input = Box.extend.attrs({
  is: 'input',
  type: 'text',
  f: 'inherit',
  w: 1,
  m: 0,
  py: 1,
  px: 2,
  color: 'inherit',
  bg: 'transparent'
})([], props => ({
  position: 'relative',
  fontFamily: 'inherit',
  lineHeight: 'inherit',
  display: 'inline-block',
  verticalAlign: 'middle',
  border: 0,
  boxShadow: `inset 0 0 0 1px ${colors.smoke}`,
  borderRadius: '4px',
  appearance: 'none',
  '&:focus': {
    outline: 'none',
    boxShadow: `inset 0 0 0 1px ${colors.info}`
  },
  '&:disabled': {
    opacity: 1 / 4
  },
  '&[type=select]': {
    background: `#fff url("data:image/svg+xml;charset=utf8,${chevron()}") no-repeat right .75rem center`,
    backgroundSize: '.5rem'
  }
}))

export const Label = Box.extend.attrs({ is: 'label', f: 2, w: 1 })`
  line-height: 1.5;
`

export const Error = Text.extend.attrs({ color: 'error', f: 1, ml: 1 })`
  text-transform: lowercase;
  &:before { content: '— '; }
`
export const Field = ({
  type = 'text',
  name = 'name',
  label,
  p,
  children,
  error,
  ...props
}) => (
  <Label className={type}>
    <Flex align="center" mb=".125rem" wrap>
      {label}
      {error && <Error children={error} />}
    </Flex>
    <Input
      name={name}
      type={type}
      is={['textarea', 'select'].indexOf(type) === -1 ? 'input' : type}
      placeholder={p}
      children={children}
      {...props}
    />
  </Label>
)

export const Submit = props => (
  <Button is="input" type="submit" bg="primary" color="white" {...props} />
)
