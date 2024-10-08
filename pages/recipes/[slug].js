import { createClient } from 'contentful'
import Image from 'next/image'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import Skeleton from '../../components/Skeleton'

//create a client using the contentful environment variables
const client = createClient({
  space:  process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
})

export const getStaticPaths = async () => {
  //wait for the client to be ready and save all the data to the response variable
  const response = await client.getEntries({
    content_type: 'recipe'
  })

  const paths = response.items.map(item => {
    return {
      params: { slug: item.fields.slug }
    };
  });

  return {
    paths,
    fallback: true //if the page is not found, fallback to the index page, if set false it will throw a 404 error
  }
}

export const getStaticProps = async ({ params }) => {
  //wait for the client to be ready and save all the data to the response variable
  const { items } = await client.getEntries({
    content_type: 'recipe',
    'fields.slug': params.slug
  })

  if (!items.length) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: { recipe: items[0] },
    revalidate: 1
  }


}

export default function RecipeDetails({ recipe }) {
  if (!recipe) return <Skeleton />

  const { featuredImage, title, cookingTime, ingredients, method } = recipe.fields

  return (
    <div>
      <div className="banner">
        <Image 
          src={'https:' + featuredImage.fields.file.url}
          alt={featuredImage.fields.title}
          width={1200}
          height={400}
        />
        <h2>{title}</h2>
      </div>

      <div className="info">
        <p>Take about {cookingTime} minutes to prepare</p>
        <h3>Ingredients</h3>

        {ingredients.map(ingredient => (
          <span key={ingredient}>{ingredient}</span>
        ))}
      </div>

      <div className="method">
        <h3>Method</h3>
        <div>{documentToReactComponents(method)}</div>
      </div>

      <style jsx>{`
        h2,h3 {
          text-transform: uppercase;
        }
        .banner h2 {
          margin: 0;
          background: #fff;
          display: inline-block;
          padding: 20px;
          position: relative;
          top: -60px;
          left: -10px;
          transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0,0,0,0.1);
        }
        .info p {
          margin: 0;
        }
        .info span::after {
          content: ", ";
        }
        .info span:last-child::after {
          content: ".";
        }
      `}</style>
    </div>
  )
}