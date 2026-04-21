import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import BackButton from '../components/BackButton';
import Seo from '../components/Seo';

function CV({ cvDatas }) {
    if (!cvDatas || !Array.isArray(cvDatas) || cvDatas.length === 0) {
        return <div className='loading'>
            <p>Loading ... </p>
        </div> // Render a loading message or alternative content
    }

    const cvData = cvDatas[0] || {};
    const exhibitions = cvData.exhibitions || [];
    const educations = cvData.educations || [];
    const projects = cvData.Projects || cvData.projects || [];
    const primaryInstitution = educations[0]?.inst;
    const cvDescription = primaryInstitution
        ? `CV of Varga Szabolcs Lajos featuring exhibitions, education history, and projects, including studies at ${primaryInstitution}.`
        : 'CV of Varga Szabolcs Lajos featuring exhibitions, education history, and projects.';
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Varga Szabolcs Lajos',
        jobTitle: 'Artist',
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        alumniOf: educations
            .filter((education) => education?.inst)
            .map((education) => ({
                '@type': 'CollegeOrUniversity',
                name: education.inst,
                department: education.department || undefined,
            })),
    };

    return (
        <>
            <Seo
                title='CV, Education and Exhibitions'
                description={cvDescription}
                structuredData={structuredData}
            />
            <BackButton />
            <div className='background01'></div>
            <div className='exhibitions exhibModifier'>
                <div className='exhibition'>
                    <h1>Curriculum Vitae</h1>
                    <p>
                        Varga Szabolcs Lajos is a visual artist working across painting, writing, and
                        independent projects. This CV page collects exhibition history, education
                        background, and selected projects in one place.
                    </p>
                </div>
                <div className='exhibition'>
                    <h1>Exhibitions</h1>
                    {Array.isArray(exhibitions) ? (
                        exhibitions.map((exhibition, idx) => (
                            <Container className='exhib' key={`${exhibition.year}-${exhibition.title}-${idx}`}>
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
                            <Container className='exhib' key={`${education.startYear}-${education.inst}-${idx}`}>
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
                            <Container className='exhib' key={`${project.year}-${project.name}-${idx}`}>
                                <Row>
                                    <Col>{project.year}</Col>
                                    <Col sm={4} ><a href={project.link} target="_blank" rel="noreferrer">{project.name}</a></Col>
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

export default CV;
