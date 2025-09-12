type Props = {
    name: string;
    value: string;
    
   onChange:(value: string) => void;
  
    
}
export default function Inputs ({name  , value , onChange }:Props){
    return (
    <>
    <div className="form-floating mb-3">

     <input  className="form-control" id="floatingInput" placeholder="name@example.com"
      value={value}
      
      onChange={(e)  => onChange(e.target.value)}
      />

    <label htmlFor="floatingInput">
     {name}
    </label>
      </div>
    
    </>
)}