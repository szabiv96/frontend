import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import BackButton from '../components/BackButton';

function CarefullyKept({ cvDatas }) {

    const exhibitions = cvDatas[0]?.exhibitions || [];
    const educations = cvDatas[0]?.educations || [];
    const projects = cvDatas[0]?.Projects || [];
    console.log(cvDatas);

    if (!cvDatas || !Array.isArray(cvDatas) || cvDatas.length === 0) {
        return <div className='loading'>
            <p>Loading ... </p>
        </div> // Render a loading message or alternative content
    }


    return (
        <>
            <BackButton />
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
                <div className='exhibition'>
                    <h1>Educations</h1>
                    {Array.isArray(educations) ? (
                        educations.map((education, idx) => (
                            <Container className='exhib' key={idx}>
                                <Row>
                                    <Col>{education.startYear} - {education.finishYear}</Col>
                                    <Col sm={4}>{education.inst}</Col>
                                    <Col>{education.department}</Col>
                                </Row>
                            </Container>
                        ))
                    ) : (
                        <p>No education data available.</p>
                    )}
                </div>
                <div className='exhibition'>
                    <h1>Projects</h1>
                    {Array.isArray(projects) ? (
                        projects.map((project, idx) => (
                            <Container className='exhib' key={idx}>
                                <Row>
                                    <Col>{project.year}</Col>
                                    <Col sm={4} ><a href={project.link} target="_blank">{project.name}</a></Col>
                                    <Col>{project.genre}</Col>
                                </Row>
                            </Container>
                        ))
                    ) : (
                        <p>No education data available.</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default CarefullyKept;
