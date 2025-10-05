type SelectorProps = {
  name: string;
  medicos: { id: number; nombre: string }[];
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function Selector({ name, medicos, value, onChange }: SelectorProps) {
  return (
    <div className="mb-3">
      <label htmlFor={name}>Médico</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="form-control"
        required
      >
        <option value="">Seleccione un médico</option>
        {medicos.map((medico) => (
          <option key={medico.id} value={medico.id}>
            {medico.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
