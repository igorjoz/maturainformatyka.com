import Arrow from "./Arrow";

export default function Footer({
  year,
  name,
  personal,
}: {
  year: number;
  name: string;
  personal: string;
}) {
  return (
    <footer className="container footer">
      <span>
        © {year} {name}
      </span>
      <span>Matura z informatyki. Przygotowanie z planem. <a href="/#o-mnie">O mnie</a></span>
      <a href={personal}>
        Strona osobista <Arrow diagonal />
      </a>
      <span className="page-end" data-page-end aria-hidden="true" />
    </footer>
  );
}
