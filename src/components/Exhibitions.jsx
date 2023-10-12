import { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function Exhibitions({ exhibitions }) {

    const [open, setOpen] = useState(false);

    /* console.log(exhibitions); */

    const latestExhibs = exhibitions.slice(0, 4);
/*     console.log(latestExhibs); */

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
                                <Container className='exhib' key={idx}>
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
                        <a href='/cv'><h3>... more of the CV!</h3></a>
                    </div>
                </div>
            </Collapse>
        </>
    )
}
