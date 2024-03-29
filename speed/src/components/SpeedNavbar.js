import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.css";

const SpeedNavbar = () => {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">Speed</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="Play">Play</Nav.Link>
          <Nav.Link href="Login">Login</Nav.Link>
          <Nav.Link href="Register">Register</Nav.Link>
          <Nav.Link href="How-To-Play">How-to-Play</Nav.Link>
          <Nav.Link href="deck">Deck</Nav.Link>
          <Nav.Link href="Scores">Scores</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default SpeedNavbar;
