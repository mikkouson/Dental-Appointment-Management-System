interface HeadingProps {
  title: string;
  description: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight sm:text-3xl ">{title}</h2>
      <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
