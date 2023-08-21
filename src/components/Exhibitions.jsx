import { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function Exhibitions({ exhibitions }) {

    const [open, setOpen] = useState(false);


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
                        {Array.isArray(exhibitions) ? (
                            exhibitions.map((exhibition, idx) => (
                                <Container className='exhib' key={idx}>
                                    <Row>
                                        <Col>{exhibition.year}</Col>
                                        <Col xs={5}>{exhibition.title}</Col>
                                        <Col>{exhibition.space}</Col>
                                        <Col>{exhibition.place}</Col>
                                    </Row>
                                </Container>
                            ))
                        ) : (
                            <p>Please reload the page!</p>
                        )}
                    </div>
                </div>
            </Collapse>
        </>
    )
}
