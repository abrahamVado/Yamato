export default function Table({ columns, rows, onRowClick }) {
  return (
    <table className="table">
      <thead>
        <tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.id} onClick={()=>onRowClick && onRowClick(r)} style={{cursor:onRowClick?'pointer':'default'}}>
            {columns.map(c => <td key={c.key}>{c.render ? c.render(r[c.key], r) : r[c.key]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
