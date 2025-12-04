import './PlaceholderPage.css';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: string;
}

export function PlaceholderPage({ title, description, icon }: PlaceholderPageProps) {
  return (
    <div className="placeholder-container">
      <div className="placeholder-content">
        <div className="placeholder-icon">{icon}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}