import Arrows from '../components/Arrows'
import Contact from '../components/Contact'
import CvDropdown from '../components/CvDropdown'
import News from '../components/News'

function Home({
  cvDatas
}) {
  return (
    <>
        <div className='landingIMG'></div>
        <div className='landingText01'><h3>"They made <br /> me do it!"</h3></div>
        <div className='landingText02'>
          <h3>VARGA SZABOLCS LAJOS</h3><h3 className='n'>&nbsp;VARGA SZABOLCS LAJOS</h3>
        </div>
        <div className='landingText03'>
          <h3>VARGA SZABOLCS LAJOS</h3><h3 className='n'>&nbsp;VARGA SZABOLCS LAJOS</h3>
        </div>
        <Arrows />
        <News />
        <CvDropdown cvDatas={cvDatas} />
        <Contact />
    </>
  )
}

export default Home;