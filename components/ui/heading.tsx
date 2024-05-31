interface HeadingProps {
    description: String,
    title: String
}

const Heading: React.FC<HeadingProps> = ({description, title}) => {
  return (
    <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export default Heading