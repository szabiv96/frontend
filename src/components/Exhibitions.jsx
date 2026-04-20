import { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

export default function Exhibitions({ exhibitions }) {

    const [open, setOpen] = useState(false);

    const latestExhibs = exhibitions.slice(0, 4);

    return (
        <>
            <Button
                variant="secondary"
                onClick={() => setOpen(!open)}
                aria-controls="example-collapse-text"
                aria-expanded={open}
            >
                EXHIBITION HISTORY
            </Button>
            <Collapse in={open}>
                <div id="example-collapse-text">
                    <div className='exhibition'>
                        {Array.isArray(latestExhibs) ? (
                            latestExhibs.map((exhibition, idx) => (
                                <Container className='exhib' key={`${exhibition.year}-${exhibition.title}-${idx}`}>
                                    <Row>
                                        <Col sm={4}>{exhibition.year}</Col>
                                        <Col sm={4}>{exhibition.title}</Col>
                                        <Col>{exhibition.space}</Col>
                                        <Col>{exhibition.place}</Col>
                                    </Row>
                                </Container>
                            ))
                        ) : (
                            <p>Please reload the page!</p>
                        )}
                        <Link to="/cv"><h3>... more of the CV!</h3></Link>
                    </div>
                </div>
            </Collapse>
        </>
    )
}
