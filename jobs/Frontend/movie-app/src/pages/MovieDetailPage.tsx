import { useParams } from "react-router-dom"
import styled from "styled-components"
import { useGetMovieQuery } from "@/features/api/apiSlice"
import ErrorCard from "@/components/ErrorCard"
import { Badge, BadgeContainer } from "@/components/badges"
import Poster from "@/components/Poster"
import BackNavigationButton from "@/components/BackNavigationButton"

interface MovieDetailInterface {
  title: string
  overview: string
  homepage: string
  poster_path: string
  genres: { id: number; name: string }[]
  vote_average: number
  vote_count: number
  popularity: number
  release_date: string
  status: string
  budget: number
  revenue: number
  belongs_to_collection: { name: string }
  production_companies: { id: number; name: string }[]
  production_countries: { iso_3166_1: string; name: string }[]
}

const OverviewContainer = styled.div`
  margin: 1rem 0;
`

const MovieDetailHeader = styled.div`
  margin-bottom: 1rem;
`

const MovieDetailContainer = styled.div`
  & h3 {
    margin-bottom: 1rem;
  }
  margin-top: 1rem;
  display: flex;
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
  align-items: center;
  flex-direction: column-reverse;
  line-height: 1.5;
  justify-content: space-between;
`

const MovieDetailTitle = styled.h2`
  text-align: center;
  @media (min-width: 768px) {
    text-align: left;
  }
`

const PosterContainer = styled.div`
  @media (min-width: 768px) {
    margin-left: 1rem;
  }
  margin-bottom: 1rem;
`

function ExtraInformation({ movie }: { movie: MovieDetailInterface }) {
  const {
    homepage,
    vote_average: voteAvg,
    vote_count: voteCount,
    popularity,
    release_date: releaseDate,
    status,
    belongs_to_collection: collection,
    budget,
    revenue,
    production_companies: prodCompanies,
    production_countries: prodCountries,
  } = movie
  return (
    <div>
      <h3>Information</h3>
      <ul>
        <li>
          <b>Homepage:</b>{" "}
          <a href={homepage} target="_blank">
            External link
          </a>
        </li>
        <li data-testid="movieScore">
          <b>Score:</b> {voteAvg || "Unknown"} out of 10
          {voteCount > 0 && (
            <span> (from {voteCount.toLocaleString()} votes)</span>
          )}
        </li>
        <li data-testid="moviePopularity">
          <b>Popularity:</b> {popularity || "Unknown"}
        </li>
        <li data-testid="movieReleaseDate">
          <b>Release date:</b> {releaseDate || "Unknown"}
        </li>
        <li data-testid="movieStatus">
          <b>Status:</b> {status}
        </li>
        <li data-testid="movieCollection">
          <b>Collection:</b>{" "}
          {collection?.name || "Doesn't belong to a collection"}
        </li>
        <li data-testid="movieBudget">
          <b>Budget:</b> {budget ? budget.toLocaleString() : "Unknown"}
        </li>
        <li data-testid="movieRevenue">
          <b>Revenue:</b> {revenue ? revenue.toLocaleString() : "Unknown"}
        </li>
        <li data-testid="movieProductionCompanies">
          <b>Production companies:</b>{" "}
          {prodCompanies.length > 0
            ? prodCompanies.map((company, i: number) => (
                <span key={company.id}>
                  {i > 0 && ", "}
                  {company.name}
                </span>
              ))
            : "Unknown"}
        </li>
        <li data-testid="movieProductionCountries">
          <b>Production countries:</b>{" "}
          {prodCountries.length > 0
            ? prodCountries.map((country, i: number) => (
                <span key={country.iso_3166_1}>
                  {i > 0 && ", "}
                  {country.name}
                </span>
              ))
            : "Unknown"}
        </li>
      </ul>
    </div>
  )
}

function MovieDetail({ movie }: { movie: MovieDetailInterface }) {
  return (
    <>
      <MovieDetailTitle>{movie.title}</MovieDetailTitle>
      <MovieDetailContainer>
        <div>
          {movie.genres.length > 0 && (
            <BadgeContainer>
              {movie.genres.map((genre) => (
                <Badge key={genre.id}>{genre.name}</Badge>
              ))}
            </BadgeContainer>
          )}
          <OverviewContainer>
            <h3>Overview</h3>
            <p>{movie.overview || "There isn't an available overview."}</p>
          </OverviewContainer>
          <ExtraInformation movie={movie} />
        </div>
        <PosterContainer>
          <Poster
            url={movie.poster_path}
            title={movie.title}
            height="450px"
            width="300px"
          />
        </PosterContainer>
      </MovieDetailContainer>
    </>
  )
}

function MovieDetailPage() {
  const { movieId } = useParams()
  const {
    data: movie,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetMovieQuery({ id: movieId })

  return (
    <div>
      <MovieDetailHeader>
        <BackNavigationButton />
      </MovieDetailHeader>
      {isLoading && <p>Loading...</p>}
      {isSuccess && movie && <MovieDetail movie={movie} />}
      {isSuccess && !movie && <p>Movie wasn't found</p>}
      {isError && <ErrorCard error={error} />}
    </div>
  )
}

export default MovieDetailPage
