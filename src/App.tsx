export interface AppProps {
  title?: string;
}

export function App({ title = 'capstone-clothing-ecommerce' }: AppProps) {
  return (
    <main>
      <h1>{title}</h1>
    </main>
  );
}
