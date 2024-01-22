
import useFetch from './hooks/useFetch';


function App() {

  // const query = `
  //   query($title: String!) {
  //     game(title: $title){
  //       creator {
  //         name
  //         gamesPublished {
  //           title
  //         }
  //       }
  //     }
  //   }
  // `;

  //const variables = { title: "Final Fantasy 7 Remake" };

  
  const query = `
    mutation($id: ID!) {
      deleteGame(id: $id){
        title
      }
    }
  `;

  const variables = { id: "3" };


  const { isPending, data, error } = useFetch({ 
    url: 'http://localhost:4000',   // graphQL endpoint
    options: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    },
    timeout: 5000
  });

  return (
    <div>
      <div>
        {isPending ? <p>Loading...</p> : <></>}
      </div>
      
      <div>
        {error ? <p>{error}</p> : <></>}
      </div>
      
      { 
        data ?
          <div>
            <h1>Query result</h1>
            {/* {data.data.game.creator.gamesPublished.map((g, i) => 
              <div key={i}>{g.title}</div>)} */}
            {data.data.deleteGame.map((g, i) => 
              <div key={i}>{g.title}</div>)}
          </div>
          :
        <></>
      }
    </div>
  );
}

export default App;