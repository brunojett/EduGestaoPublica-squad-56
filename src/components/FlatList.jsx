export default function FlatList({
  data = [],
  renderItem,
  keyExtractor,
  ListEmptyComponent,
  className = "",
  ...props
}) {
  if (data.length === 0) {
    return ListEmptyComponent || null;
  }

  return (
    <ul className={className} {...props}>
      {data.map((item, index) => (
        <li key={keyExtractor ? keyExtractor(item, index) : index}>
          {renderItem({ item, index })}
        </li>
      ))}
    </ul>
  );
}
