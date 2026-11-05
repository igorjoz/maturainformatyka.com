export default function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={`arrow${diagonal ? " diagonal" : ""}`}
      >
        <path
          d="M5 12h14m-6-6 6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
}
