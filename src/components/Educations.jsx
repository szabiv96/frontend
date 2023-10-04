import { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function Educations({ educations }) {

    const [open2, setOpen2] = useState(false);

    return (
        <>
            <Button
                variant="secondary"
                onClick={() => setOpen2(!open2)}
                aria-controls="example-collapse-text"
                aria-expanded={open2}
            >
                EDUCATION HISTORY
            </Button>
            <Collapse in={open2}>
                <div id="example-collapse-text">
                    <div className='exhibition'>
                        {Array.isArray(educations) ? (
                            educations.map((exhibition, idx) => (
                                <Container className='exhib' key={idx}>
                                    <Row>
                                        <Col>{exhibition.startYear} - {exhibition.finishYear}</Col>
                                        <Col xs={5}>{exhibition.inst}</Col>
                                        <Col>{exhibition.department}</Col>
                                    </Row>
                                </Container>
                            ))
                        ) : (
                            <p>No education data available.</p>
                        )}
                    </div>

                </div>
            </Collapse>
        </>
    )
}
