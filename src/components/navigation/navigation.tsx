import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { matchPath, NavLink, useLocation } from "react-router-dom";
import type { NavigationItem, PageRegistry } from "../../pageRegistry/types";

function containsPath(item: NavigationItem, pathname: string): boolean {
  return item.kind === "page"
    ? item.path.toLowerCase() === pathname.replace(/\/+$/, "").toLowerCase()
    : item.children.some((child) => containsPath(child, pathname));
}

function DropdownItems({ items, activeKey }: { items: NavigationItem[]; activeKey: string }) {
  return items.map((item) => item.kind === "page" ? (
    <NavDropdown.Item
      key={item.id}
      eventKey={item.path}
      as={NavLink}
      to={item.path}
      end={item.path !== activeKey}
    >
      {item.title}
    </NavDropdown.Item>
  ) : (
    <div
      key={item.id}
      role="group"
      aria-labelledby={`navigation-${encodeURIComponent(item.id)}`}
    >
      <NavDropdown.Header id={`navigation-${encodeURIComponent(item.id)}`}>
        {item.title}
      </NavDropdown.Header>
      <DropdownItems items={item.children} activeKey={activeKey} />
    </div>
  ));
}

function Navigation({ registry }: { registry: PageRegistry }) {
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState(false);
  const activeKey = registry.pages.find(({ path }) =>
    matchPath({ path, end: true }, pathname),
  )?.path ?? "";
  return (
    <Navbar bg="light" expand="lg" collapseOnSelect expanded={expanded} onToggle={setExpanded}>
      <Container fluid>
        <Navbar.Brand as={NavLink} to={registry.home.path} end>
          {registry.home.title}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" aria-expanded={expanded} />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" activeKey={activeKey}>
            {registry.navigation.map((item) => item.kind === "page" ? (
              <Nav.Link
                key={item.id}
                eventKey={item.path}
                as={NavLink}
                to={item.path}
                end={item.path !== activeKey}
              >
                {item.title}
              </Nav.Link>
            ) : (
              <NavDropdown
                key={item.id}
                title={item.title}
                id={`navigation-${encodeURIComponent(item.id)}`}
                active={containsPath(item, pathname)}
                focusFirstItemOnShow="keyboard"
              >
                <DropdownItems items={item.children} activeKey={activeKey} />
              </NavDropdown>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
