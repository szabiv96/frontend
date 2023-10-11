import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function CarefullyKept({ cvDatas }) {

    const exhibitions = cvDatas[0]?.exhibitions || [];

    if (!cvDatas || !Array.isArray(cvDatas) || cvDatas.length === 0) {
        return <div className='loading'>
            <p>Loading ... </p>
        </div> // Render a loading message or alternative content
    }


    return (
        <>
            <div className='background01'></div>
            <div className='exhibitions exhibModifier'>
                <div className='exhibition'>
                    <h1>Exhibitions</h1>
                    {Array.isArray(exhibitions) ? (
                        exhibitions.map((exhibition, idx) => (
                            <Container className='exhib' key={idx}>
                                <Row>
                                    <Col sm={4}>{exhibition.year}</Col>
                                    <Col sm={4}>{exhibition.title}</Col>
                                    <Col >{exhibition.space}</Col>
                                    <Col >{exhibition.place}</Col>
                                </Row>
                            </Container>
                        ))
                    ) : (
                        <p>Please reload the page!</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default CarefullyKept;
