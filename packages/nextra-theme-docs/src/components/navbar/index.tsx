import type { ReactElement } from 'react'
import type { NavbarProps } from './navbar';
import { Navbar } from './navbar'

export default function NavbarWrapper(props: NavbarProps): ReactElement {
  return <Navbar {...props} />
}
