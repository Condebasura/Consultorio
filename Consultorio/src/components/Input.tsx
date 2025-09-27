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
    <div className="form-floating mb-3">

     <input  className="form-control" id="floatingInput" 
      value={value}
      type={type}
      required={required}
      onChange={(e)  => onChange(e.target.value)}
      />

    <label htmlFor="floatingInput">
     {name}
    </label>
      </div>
    
    </>
)}