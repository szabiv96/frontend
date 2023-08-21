import Exhibitions from './Exhibitions';
import Educations from './Educations';

export default function CvDropdown({ cvDatas }) {
  // Check if cvDatas exists and is an array
  if (!cvDatas || !Array.isArray(cvDatas) || cvDatas.length === 0) {
    return null; // Render nothing if cvDatas is undefined, not an array, or an empty array
  }

  const educations = cvDatas[0]?.educations || [];
  const exhibitions = cvDatas[0]?.exhibitions || [];

  return (
    <>
      <div className='exhibitions'>
        <Exhibitions exhibitions={exhibitions} />
        <Educations educations={educations} />
      </div>
    </>
  );
}
