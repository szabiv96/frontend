export default function Arrows() {
  const arrows = Array.from({ length: 14 }, (_, index) => `arrow${String(index + 1).padStart(2, '0')}`);

  return (
    <>
      {arrows.map((className) => (
        <svg
          key={className}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1299.08 1976.83"
          fill="none"
        >
          <polygon
            points="639.54 .24 547.61 1595.36 3.54 730.18 651.54 1968.24 1295.54 750.24 736.65 1593.39 639.54 .24"
            stroke="currentColor"
            strokeMiterlimit="10"
            strokeWidth="8"
          />
        </svg>
      ))}
    </>
  );
}
