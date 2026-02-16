type Props ={
    texto: string;
}

export default function Text({texto}: Props){
    return(
        <div className="flex flex-row  justify-center  " >

        <h3 className="mt-5  p-3 lg:text-[2em] ms:text[0.5em] text-cyan-900">{texto}</h3>
        </div>
    )
} 