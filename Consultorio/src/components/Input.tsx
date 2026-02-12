type Props = {
    name: string;
    value: string;
   onChange:(value: string) => void;
  type?: string;
  required?: boolean;
  
    
}
export default function Inputs ({name  , value , onChange, type = "text" , required = false}:Props){
    return (
    <>
    <div className="grid grid-cols-2 gap-2">
 <label htmlFor="floatingInput" className="form-label inline-block mb-2 text-gray-700">
     {name}
    </label>
     <input  className="border rounded px-3 py-2" id="floatingInput" 
      value={value}
      type={type}
      required={required}
      onChange={(e)  => onChange(e.target.value)}
      />

   
      </div>
    
    </>
)}