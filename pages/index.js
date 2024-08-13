import { createClient } from 'contentful'
import RecipeCard from '../components/RecipeCard'

//async function to get all the recipes from contentful and pass them to the Recipes component
export async function getStaticProps() {

  //create a client using the contentful environment variables
  const client = createClient({
    space:  process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
  })

  //wait for the client to be ready and save all the data to the response variable
  const response = await client.getEntries({
    content_type: 'recipe'
  })

  //return the responese as props.recipes to the Recipes component
  return {
    props: { recipes: response.items },
    revalidate: 1
  }
}

//render the Recipes component with the recipes passed as props by deconstructing the props into recipes variable
export default function Recipes({ recipes }) {
  console.log(recipes)
  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.sys.id} recipe={recipe} />
      ))}

      <style jsx>{`
        .recipe-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 60px;
        }
      `}</style>
    </div>
  )
}