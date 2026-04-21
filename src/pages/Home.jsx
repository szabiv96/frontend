import Arrows from '../components/Arrows'
import Contact from '../components/Contact'
import CvDropdown from '../components/CvDropdown'
import News from '../components/News'
import Seo from '../components/Seo';
import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION } from '../utils/seo';

function Home({
  cvDatas,
  posts,
  authors
}) {
  return (
    <>
        <Seo
          title='Home'
          description={SITE_DESCRIPTION}
          image={DEFAULT_OG_IMAGE}
          structuredData={{
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Varga Szabolcs Lajos',
            jobTitle: 'Artist',
            description: SITE_DESCRIPTION,
            image: DEFAULT_OG_IMAGE,
            sameAs: [
              'https://www.instagram.com/szabolcs.lajos/',
              'https://www.behance.net/szabolcsvarga96',
            ],
          }}
        />
        <div className='landingIMG'></div>
        <div className='landingText01'><h3>"They made <br /> me do it!"</h3></div>
        <div className='landingTextWelcome'><h3>Self representational website.</h3></div>
        <div className='landingText02'>
          <h3>VARGA SZABOLCS LAJOS</h3><h3 className='n'>&nbsp;VARGA SZABOLCS LAJOS</h3>
        </div>
        <div className='landingText03'>
          <h3>VARGA SZABOLCS LAJOS</h3><h3 className='n'>&nbsp;VARGA SZABOLCS LAJOS</h3>
        </div>
        <Arrows />
        <News posts={posts} authors={authors} />
        <CvDropdown cvDatas={cvDatas} />
        <Contact />
    </>
  )
}

export default Home;
