
import useFetch from './hooks/useFetch';


function App() {

  const query = `
    query($title: String!) {
      game(title: $title){
        creator {
          name
          gamesPublished {
            title
          }
        }
      }
    }
  `;

  const variables = { title: "Final Fantasy 7 Remake" };

  const { isPending, data, error } = useFetch({ 
    url: 'http://localhost:4000',   // graphQL endpoint
    options: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    },
    timeout: 5000
  });

  //console.log({ isPending, data, error });

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Query result</h1>
      { 
        data ?
          data.data.game.creator.gamesPublished.map((g, i) => 
            <div key={i}>{g.title}</div>)
          :
        <></>
      }
    </div>
  );
}

export default App;