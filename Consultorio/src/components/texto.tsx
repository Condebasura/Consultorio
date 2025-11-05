type Props ={
    texto: string;
}

export default function Text({texto}: Props){
    return(
        <h3 className="mt-5 link-primary p-3 ">{texto}</h3>
    )
} 