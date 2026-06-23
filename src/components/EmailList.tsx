type EmailListProps = {
  listTitle: string;
  list: string[];
};

export default function EmailList({ listTitle, list }: EmailListProps) {
  return (
    <section className={"space-y-2"}>
      <h3 className={"font-bold"}>{listTitle}</h3>
      <ul>
        {list.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
